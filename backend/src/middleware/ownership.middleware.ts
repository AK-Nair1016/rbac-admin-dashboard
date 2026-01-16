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

    // Admin & Manager bypass ownership
    if (user.role === "admin" || user.role === "manager") {
      return next();
    }

    const query = `
      SELECT owner_id
      FROM entities
      WHERE id = $1
    `;

    const result = await pool.query(query, [entityId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Entity not found" });
    }

    const ownerId = result.rows[0].owner_id;

    if (ownerId !== user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Ownership check failed" });
  }
};
