import { Request, Response } from "express";
import pool from "../config/db";

/**
 * GET all permissions (for Users page)
 * Admin / Manager only
 */
export const getAllPermissions = async (
  req: Request,
  res: Response
) => {
  try {
    const query = `
      SELECT
        ep.id,
        u.email AS user_email,
        e.name AS entity_name,
        ep.permission,
        ep.user_id,
        ep.entity_id
      FROM entity_permissions ep
      JOIN users u ON u.id = ep.user_id
      JOIN entities e ON e.id = ep.entity_id
      ORDER BY u.email, e.name
    `;

    const result = await pool.query(query);

    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error("GET PERMISSIONS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch permissions",
    });
  }
};

/**
 * UPSERT permission (create or update)
 */
export const upsertPermission = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, entityId, permission } = req.body;

    if (!userId || !entityId || !permission) {
      return res.status(400).json({
        message: "userId, entityId and permission are required",
      });
    }

    if (!["READ", "WRITE", "READ_WRITE"].includes(permission)) {
      return res.status(400).json({
        message: "Invalid permission value",
      });
    }

    const query = `
      INSERT INTO entity_permissions (user_id, entity_id, permission)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, entity_id)
      DO UPDATE SET
        permission = EXCLUDED.permission,
        updated_at = NOW()
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId,
      entityId,
      permission,
    ]);

    return res.status(200).json({
      message: "Permission saved",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("UPSERT PERMISSION ERROR:", error);
    return res.status(500).json({
      message: "Failed to save permission",
    });
  }
};
