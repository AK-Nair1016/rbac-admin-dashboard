import { Request, Response } from "express";
import pool from "../config/db";

/**
 * GET assignable users
 * Admin / Manager only
 * Used for entity assignment dropdown
 */
export const getAssignableUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const query = `
      SELECT id, email, employee_id
      FROM users
      ORDER BY created_at ASC
    `;

    const result = await pool.query(query);

    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error("GET ASSIGNABLE USERS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};
