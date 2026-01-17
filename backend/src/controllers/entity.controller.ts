import { Request, Response } from "express";
import pool from "../config/db";

// CREATE entity (Admin, Manager)
export const createEntity = async (req: Request, res: Response) => {
  console.log("🟢 Entered createEntity controller");
  try {
    const { name, status, ownerId } = req.body;

    if (!name || !ownerId) {
      return res
        .status(400)
        .json({ message: "Name and ownerId are required" });
    }

    const query = `
      INSERT INTO entities (name, status, owner_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [name, status, ownerId]);

    return res.status(201).json({
      message: "Entity created successfully",
      entity: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE ENTITY ERROR:", error);
    return res.status(500).json({ message: "Failed to create entity" });
  }
};

// GET all entities (Admin, Manager)
export const getAllEntities = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT id, name, status, owner_id, created_at
      FROM entities
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);

    return res.status(200).json({
      entities: result.rows,
    });
  } catch (error) {
    console.error("GET ALL ENTITIES ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch entities" });
  }
};

// GET my entities (User)
export const getMyEntities = async (req: Request, res: Response) => {
  console.log("🟢 Entered getAllEntities controller");
  try {
    const user = (req as any).user;

    const query = `
      SELECT id, name, status, owner_id, created_at
      FROM entities
      WHERE owner_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [user.userId]);

    return res.status(200).json({
      entities: result.rows,
    });
  } catch (error) {
    console.error("GET MY ENTITIES ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch user entities" });
  }
};

export const getEntityById = async (req: Request, res: Response) => {
  try {
    const entityId= req.params.id;

    if(!entityId){
      return res.status(400).json({ message: "Entity ID is required" });
    }
    const query =`
      SELECT id, name, status, owner_id, created_at
      FROM entities
      WHERE id = $1
    `;

    const result= await pool.query(query,[entityId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Entity not found" });
    }

    return res.status(200).json({
      entity: result.rows[0],
    });
  } catch (error) {
    console.error("GET ENTITY BY ID ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch entity" });
  }
};

export const updateEntity = async (req: Request, res: Response) => {
  try {
    const entityId = req.params.id;
    const { name, status } = req.body;

    if (!entityId) {
      return res.status(400).json({ message: "Entity ID is required" });
    }

    if (!name && !status) {
      return res.status(400).json({
        message: "At least one field (name or status) must be provided",
      });
    }

    // Build dynamic update safely
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (name) {
      fields.push(`name = $${idx++}`);
      values.push(name);
    }

    if (status) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }

    values.push(entityId);

    const query = `
      UPDATE entities
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING id, name, status, owner_id, created_at
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Entity not found" });
    }

    return res.status(200).json({
      message: "Entity updated successfully",
      entity: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE ENTITY ERROR:", error);
    return res.status(500).json({ message: "Failed to update entity" });
  }
};

