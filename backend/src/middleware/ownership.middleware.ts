import { NextFunction, Request, Response } from "express";
import { evaluateEntityOwnershipAccess } from "../services/entity.service";
import { sendError } from "../utils/apiResponse";
import { logger } from "../utils/logger";

export const checkOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const entityId = req.params.id ? String(req.params.id) : undefined;

    if (!entityId) {
      return next();
    }

    if (!user) {
      logger.warn(
        {
          event: "authorization_ownership_missing_user",
          method: req.method,
          path: req.originalUrl,
        },
        "Ownership check attempted without authenticated user"
      );

      return sendError(res, {
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    if (user.role === "admin") {
      return next();
    }

    const access = await evaluateEntityOwnershipAccess(entityId, user);

    if (access.allowed) {
      return next();
    }

    if (access.statusCode === 404) {
      return sendError(res, {
        statusCode: 404,
        message: "Entity not found",
      });
    }

    if (user.role === "manager") {
      logger.warn(
        {
          event: "authorization_ownership_denied",
          userId: user.userId,
          role: user.role,
          entityId,
          ownerRole: access.ownerRole,
          path: req.originalUrl,
        },
        "Manager blocked from admin-owned entity"
      );

      return sendError(res, {
        statusCode: 403,
        message: access.message,
      });
    }

    if (user.role === "user") {
      logger.warn(
        {
          event: "authorization_ownership_denied",
          userId: user.userId,
          role: user.role,
          entityId,
          ownerId: access.ownerId,
          path: req.originalUrl,
        },
        "User blocked from entity they do not own"
      );

      return sendError(res, {
        statusCode: 403,
        message: access.message,
      });
    }

    logger.warn(
      {
        event: "authorization_ownership_denied",
        userId: user.userId,
        role: user.role,
        entityId,
        ownerId: access.ownerId,
        ownerRole: access.ownerRole,
        path: req.originalUrl,
      },
      "Access denied by ownership rules"
    );

    return sendError(res, {
      statusCode: 403,
      message: access.message,
    });
  } catch (error) {
    logger.error(
      {
        event: "authorization_ownership_check_failed",
        path: req.originalUrl,
        error,
      },
      "Ownership check failed"
    );

    return sendError(res, {
      statusCode: 500,
      message: "Ownership check failed",
    });
  }
};
