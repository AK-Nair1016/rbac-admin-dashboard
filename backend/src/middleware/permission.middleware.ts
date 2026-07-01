import { Request, Response, NextFunction } from "express";
import { hasRequiredEntityPermission } from "../services/permission.service";
import { logger } from "../utils/logger";
import { sendError } from "../utils/apiResponse";

export const enforceEntityPermission =
  (required: "READ" | "WRITE") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const entityId = req.params.id ? String(req.params.id) : undefined;

      // 🔹 Admin & Manager bypass
      if (["admin", "manager"].includes(user.role)) {
        return next();
      }

      // 🔹 Only enforce for entity-specific routes
      if (!entityId) {
        return next();
      }

      const permissionCheck = await hasRequiredEntityPermission({
        userId: user.userId,
        entityId,
        required,
      });

      if (permissionCheck.reason === "missing") {
        logger.warn(
          {
            event: "authorization_entity_permission_missing",
            userId: user.userId,
            entityId,
            requiredPermission: required,
            path: req.originalUrl,
          },
          "User has no permission for entity"
        );

        return sendError(res, {
          statusCode: 403,
          message: "No permission for this entity",
        });
      }

      if (!permissionCheck.allowed) {
        logger.warn(
          {
            event: "authorization_entity_permission_denied",
            userId: user.userId,
            entityId,
            requiredPermission: required,
            actualPermission: permissionCheck.permission,
            path: req.originalUrl,
          },
          "User has insufficient permission for entity"
        );

        return sendError(res, {
          statusCode: 403,
          message: "Insufficient permission",
        });
      }

      return next();
    } catch (error) {
      logger.error(
        {
          event: "authorization_entity_permission_check_failed",
          path: req.originalUrl,
          error,
        },
        "Entity permission enforcement failed"
      );

      return sendError(res, {
        statusCode: 500,
        message: "Permission enforcement failed",
      });
    }
  };
