import { Request, Response } from "express";
import pool from "../config/db";

// 🔹 USER: get own permissions
export const getMyPermissions = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const result = await pool.query(
      `
      SELECT entity_id AS "entityId", permission
      FROM entity_permissions
      WHERE user_id = $1
      `,
      [userId]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("GET MY PERMISSIONS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch permissions" });
  }
};

// 🔹 ADMIN / MANAGER: list all permissions
export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
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
      `
    );

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("GET PERMISSIONS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch permissions" });
  }
};

// 🔹 ADMIN / MANAGER: create or update permission
export const upsertPermission = async (req: Request, res: Response) => {
  try {
    const { userId, entityId, permission } = req.body;

    if (!userId || !entityId || !permission) {
      return res.status(400).json({
        message: "userId, entityId and permission are required",
      });
    }

    if (!["READ", "WRITE", "READ_WRITE"].includes(permission)) {
      return res.status(400).json({ message: "Invalid permission value" });
    }

    const result = await pool.query(
      `
      INSERT INTO entity_permissions (user_id, entity_id, permission)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, entity_id)
      DO UPDATE SET permission = EXCLUDED.permission
      RETURNING *
      `,
      [userId, entityId, permission]
    );

    return res.status(200).json({
      message: "Permission saved",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("UPSERT PERMISSION ERROR:", error);
    return res.status(500).json({ message: "Failed to save permission" });
  }
};
