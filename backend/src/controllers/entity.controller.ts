import { Request, Response } from "express";
import pool from "../config/db";

// CREATE entity (Admin, Manager)
export const createEntity = async (req: Request, res: Response) => {
  console.log("🟢 [CREATE ENTITY] Entered");

  try {
    const { name, status } = req.body;
    const ownerId = req.user!.userId;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const query = `
      INSERT INTO entities (name, status, owner_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [
      name,
      status ?? "ACTIVE",
      ownerId,
    ]);

    return res.status(201).json({
      message: "Entity created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ [CREATE ENTITY] Error:", error);

    return res.status(500).json({
      message: "Failed to create entity",
    });
  } finally {
    console.log("🔵 [CREATE ENTITY] Exited");
  }
};

// GET all entities (Admin, Manager)
export const getAllEntities = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const status = req.query.status as string | undefined;

    let whereClause = "";
    const values: any[] = [];
    let idx = 1;

    if (status) {
      whereClause = `WHERE status = $${idx++}`;
      values.push(status);
    }

    // 🔹 Data query
    const dataQuery = `
      SELECT id, name, status, owner_id, created_at
      FROM entities
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx++} OFFSET $${idx}
    `;

    const dataValues = [...values, limit, offset];
    const dataResult = await pool.query(dataQuery, dataValues);

    // 🔹 Count query (NO limit / offset)
    const countQuery = `
      SELECT COUNT(*) FROM entities
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values);

    return res.status(200).json({
      page,
      limit,
      total: Number(countResult.rows[0].count),
      data: dataResult.rows,
    });
  } catch (error) {
    console.error("GET ALL ENTITIES ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch entities" });
  }
};



// GET my entities (User)
export const getMyEntities = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // 🔹 Data query
    const dataQuery = `
      SELECT id, name, status, owner_id, created_at
      FROM entities
      WHERE owner_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const dataResult = await pool.query(dataQuery, [
      user.userId,
      limit,
      offset,
    ]);

    // 🔹 Count query
    const countQuery = `
      SELECT COUNT(*) FROM entities
      WHERE owner_id = $1
    `;

    const countResult = await pool.query(countQuery, [user.userId]);

    return res.status(200).json({
      page,
      limit,
      total: Number(countResult.rows[0].count),
      data: dataResult.rows,
    });
  } catch (error) {
    console.error("GET MY ENTITIES ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch user entities" });
  }
};


// GET EntityById
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

    if (
  (name === undefined || name.trim() === "") &&
  (status === undefined || status.trim() === "")
) {
  return res.status(400).json({
    message: "At least one valid field must be provided",
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
    if (fields.length === 0) {
  return res.status(400).json({
    message: "No valid fields to update",
  });
}


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
// UPDATE ENTITY STATUS (Admin, Manager)
// Used for inline status toggle
export const updateEntityStatus = async (req: Request, res: Response) => {
  try {
    const entityId = req.params.id;
    const { status } = req.body;

    if (!entityId) {
      return res.status(400).json({
        message: "Entity ID is required",
      });
    }

    if (status !== "ACTIVE" && status !== "INACTIVE") {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const query = `
      UPDATE entities
      SET status = $1
      WHERE id = $2
      RETURNING id, name, status, owner_id, created_at
    `;

    const result = await pool.query(query, [status, entityId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Entity not found",
      });
    }

    return res.status(200).json({
      message: "Entity status updated successfully",
      entity: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE ENTITY STATUS ERROR:", error);
    return res.status(500).json({
      message: "Failed to update entity status",
    });
  }
};
// ASSIGN USER TO ENTITY (Admin, Manager)
export const assignUserToEntity = async (req: Request, res: Response) => {
  try {
    const entityId = req.params.id;
    const { userId } = req.body;

    if (!entityId) {
      return res.status(400).json({
        message: "Entity ID is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    // Ensure entity exists
    const entityCheck = await pool.query(
      "SELECT id FROM entities WHERE id = $1",
      [entityId]
    );

    if (entityCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Entity not found",
      });
    }

    // Ensure user exists
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Insert or update assignment (one user per entity)
    const query = `
      INSERT INTO entity_assignments (entity_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (entity_id)
      DO UPDATE SET user_id = EXCLUDED.user_id
      RETURNING entity_id, user_id, created_at
    `;

    const result = await pool.query(query, [entityId, userId]);

    return res.status(200).json({
      message: "User assigned to entity successfully",
      assignment: result.rows[0],
    });
  } catch (error) {
    console.error("ASSIGN USER TO ENTITY ERROR:", error);
    return res.status(500).json({
      message: "Failed to assign user to entity",
    });
  }
};



