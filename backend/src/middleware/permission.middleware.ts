import { Request, Response, NextFunction } from "express";
import pool from "../config/db";

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
        return res.status(403).json({
          message: "No permission for this entity",
        });
      }

      const permission = result.rows[0].permission;

      const allowed =
        permission === "READ_WRITE" ||
        (permission === "READ" && required === "READ") ||
        (permission === "WRITE" && required === "WRITE");

      if (!allowed) {
        return res.status(403).json({
          message: "Insufficient permission",
        });
      }

      return next();
    } catch (error) {
      console.error("PERMISSION MIDDLEWARE ERROR:", error);
      return res.status(500).json({
        message: "Permission enforcement failed",
      });
    }
  };
