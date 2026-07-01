import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import { logger } from "../utils/logger";
import { sendError } from "../utils/apiResponse";

export const enforceEntityPermission =
  (required: "READ" | "WRITE") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const entityId = req.params.id;

      // 🔹 Admin & Manager bypass
      if (["admin", "manager"].includes(user.role)) {
        return next();
      }

      // 🔹 Only enforce for entity-specific routes
      if (!entityId) {
        return next();
      }

      const result = await pool.query(
        `
        SELECT permission
        FROM entity_permissions
        WHERE user_id = $1 AND entity_id = $2
        `,
        [user.userId, entityId]
      );

      if (result.rows.length === 0) {
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

      const permission = result.rows[0].permission;

      const allowed =
        permission === "READ_WRITE" ||
        (permission === "READ" && required === "READ") ||
        (permission === "WRITE" && required === "WRITE");

      if (!allowed) {
        logger.warn(
          {
            event: "authorization_entity_permission_denied",
            userId: user.userId,
            entityId,
            requiredPermission: required,
            actualPermission: permission,
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
