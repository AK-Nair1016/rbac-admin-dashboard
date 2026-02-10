import { Request, Response } from "express";
import pool from "../config/db";

// 🔹 USER: get own permissions (assignment-aware)
export const getMyPermissions = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const query = `
      SELECT
        ea.entity_id AS "entityId",
        COALESCE(ep.permission, 'NONE') AS permission
      FROM entity_assignments ea
      LEFT JOIN entity_permissions ep
        ON ep.user_id = ea.user_id
       AND ep.entity_id = ea.entity_id
      WHERE ea.user_id = $1
    `;

    const result = await pool.query(query, [userId]);

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("GET MY PERMISSIONS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch permissions" });
  }
};


// 🔹 ADMIN / MANAGER: list all permissions
export const getAllPermissions = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("[PERMISSIONS] Fetching all permissions");

    const query = `
      SELECT
        ea.user_id    AS "userId",
        ea.entity_id  AS "entityId",
        u.email       AS "userEmail",
        e.name        AS "entityName",
        COALESCE(ep.permission, 'NONE') AS "permission"
      FROM entity_assignments ea
      JOIN users u ON u.id = ea.user_id
      JOIN entities e ON e.id = ea.entity_id
      LEFT JOIN entity_permissions ep
        ON ep.user_id = ea.user_id
       AND ep.entity_id = ea.entity_id
      ORDER BY u.email, e.name
    `;

    const result = await pool.query(query);

    console.log("[PERMISSIONS] Rows returned:", result.rowCount);
    console.log("[PERMISSIONS] Sample row:", result.rows[0]);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("[PERMISSIONS] GET ALL ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch permissions",
    });
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
