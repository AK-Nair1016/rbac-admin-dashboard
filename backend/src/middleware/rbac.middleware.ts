import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { sendError } from "../utils/apiResponse";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user || !user.role) {
        logger.warn(
          {
            event: "authorization_missing_user",
            method: req.method,
            path: req.originalUrl,
            allowedRoles,
          },
          "Authorization attempted without authenticated user"
        );

        return sendError(res, {
          statusCode: 401,
          message: "Unauthorized",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        logger.warn(
          {
            event: "authorization_role_denied",
            userId: user.userId,
            role: user.role,
            allowedRoles,
            method: req.method,
            path: req.originalUrl,
          },
          "Access denied by role"
        );

        return sendError(res, {
          statusCode: 403,
          message: "Access Denied",
        });
      }

      return next();
    } catch (error) {
      logger.error(
        {
          event: "authorization_role_check_failed",
          method: req.method,
          path: req.originalUrl,
          error,
        },
        "Role authorization check failed"
      );

      return sendError(res, {
        statusCode: 403,
        message: "Forbidden",
      });
    }
  };
};
