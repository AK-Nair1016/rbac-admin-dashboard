import { Request, Response, NextFunction } from "express";
import pool from "../config/db";

export const checkOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const entityId = req.params.id;

    if (!user || !entityId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Admin can access everything
    if (user.role === "admin") {
      return next();
    }

    // Fetch entity owner + owner role
    const query = `
      SELECT e.owner_id, u.role AS owner_role
      FROM entities e
      JOIN users u ON e.owner_id = u.id
      WHERE e.id = $1
    `;

    const result = await pool.query(query, [entityId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Entity not found" });
    }

    const { owner_id, owner_role } = result.rows[0];

    // Manager rules
    if (user.role === "manager") {
      if (owner_role === "admin") {
        return res.status(403).json({
          message: "Managers cannot access admin-owned entities",
        });
      }
      return next(); // manager → user-owned or own entities
    }

    // User rules
    if (user.role === "user") {
      if (owner_id !== user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      return next();
    }

    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    console.error("OWNERSHIP CHECK ERROR:", error);
    return res.status(500).json({ message: "Ownership check failed" });
  }
};
