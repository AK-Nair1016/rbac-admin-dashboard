import pool from "../config/db";

export type EntityStatus = "ACTIVE" | "INACTIVE";

export type EntityRecord = {
  id: string;
  name: string;
  status: EntityStatus;
  owner_id: string;
  created_at: Date;
};

export type EntityAssignmentRecord = {
  entity_id: string;
  user_id: string;
  created_at: Date;
};

export type EntityOwnershipRecord = {
  owner_id: string;
  owner_role: string;
};

export type EntityFilters = {
  status?: string;
  search?: string;
};

export type PaginationOptions = {
  limit: number;
  offset: number;
};

export const createEntityRecord = async (
  name: string,
  status: EntityStatus,
  ownerId: string
): Promise<EntityRecord> => {
  const query = `
    INSERT INTO entities (name, status, owner_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const result = await pool.query<EntityRecord>(query, [
    name,
    status,
    ownerId,
  ]);
  return result.rows[0];
};

export const findEntities = async (
  filters: EntityFilters,
  pagination: PaginationOptions
): Promise<{ rows: EntityRecord[]; total: number }> => {
  let whereClause = "WHERE 1=1";
  const values: unknown[] = [];
  let idx = 1;

  if (filters.status) {
    whereClause += ` AND status = $${idx++}`;
    values.push(filters.status);
  }

  if (filters.search) {
    whereClause += ` AND name ILIKE $${idx++}`;
    values.push(`%${filters.search}%`);
  }

  const dataQuery = `
    SELECT id, name, status, owner_id, created_at
    FROM entities
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${idx++} OFFSET $${idx}
  `;

  const dataResult = await pool.query<EntityRecord>(dataQuery, [
    ...values,
    pagination.limit,
    pagination.offset,
  ]);

  const countQuery = `
    SELECT COUNT(*) FROM entities
    ${whereClause}
  `;

  const countResult = await pool.query<{ count: string }>(countQuery, values);

  return {
    rows: dataResult.rows,
    total: Number(countResult.rows[0].count),
  };
};

export const findEntitiesByOwner = async (
  ownerId: string,
  filters: Pick<EntityFilters, "search">,
  pagination: PaginationOptions
): Promise<{ rows: EntityRecord[]; total: number }> => {
  let whereClause = "WHERE owner_id = $1";
  const values: unknown[] = [ownerId];
  let idx = 2;

  if (filters.search) {
    whereClause += ` AND name ILIKE $${idx++}`;
    values.push(`%${filters.search}%`);
  }

  const dataQuery = `
    SELECT id, name, status, owner_id, created_at
    FROM entities
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${idx++} OFFSET $${idx}
  `;

  const dataResult = await pool.query<EntityRecord>(dataQuery, [
    ...values,
    pagination.limit,
    pagination.offset,
  ]);

  const countQuery = `
    SELECT COUNT(*) FROM entities
    ${whereClause}
  `;

  const countResult = await pool.query<{ count: string }>(countQuery, values);

  return {
    rows: dataResult.rows,
    total: Number(countResult.rows[0].count),
  };
};

export const findEntityById = async (
  entityId: string
): Promise<EntityRecord | undefined> => {
  const query = `
    SELECT id, name, status, owner_id, created_at
    FROM entities
    WHERE id = $1
  `;

  const result = await pool.query<EntityRecord>(query, [entityId]);
  return result.rows[0];
};

export const findEntityOwnership = async (
  entityId: string
): Promise<EntityOwnershipRecord | undefined> => {
  const query = `
    SELECT e.owner_id, u.role AS owner_role
    FROM entities e
    JOIN users u ON e.owner_id = u.id
    WHERE e.id = $1
  `;

  const result = await pool.query<EntityOwnershipRecord>(query, [entityId]);
  return result.rows[0];
};

export const updateEntityRecord = async (
  entityId: string,
  fields: { name?: string; status?: string }
): Promise<EntityRecord | undefined> => {
  const updates: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (fields.name) {
    updates.push(`name = $${idx++}`);
    values.push(fields.name);
  }

  if (fields.status) {
    updates.push(`status = $${idx++}`);
    values.push(fields.status);
  }

  values.push(entityId);

  const query = `
    UPDATE entities
    SET ${updates.join(", ")}
    WHERE id = $${idx}
    RETURNING id, name, status, owner_id, created_at
  `;

  const result = await pool.query<EntityRecord>(query, values);
  return result.rows[0];
};

export const updateEntityStatusRecord = async (
  entityId: string,
  status: EntityStatus
): Promise<EntityRecord | undefined> => {
  const query = `
    UPDATE entities
    SET status = $1
    WHERE id = $2
    RETURNING id, name, status, owner_id, created_at
  `;

  const result = await pool.query<EntityRecord>(query, [status, entityId]);
  return result.rows[0];
};

export const entityExists = async (entityId: string): Promise<boolean> => {
  const result = await pool.query("SELECT id FROM entities WHERE id = $1", [
    entityId,
  ]);
  return result.rows.length > 0;
};

export const userExists = async (userId: string): Promise<boolean> => {
  const result = await pool.query("SELECT id FROM users WHERE id = $1", [
    userId,
  ]);
  return result.rows.length > 0;
};

export const upsertEntityAssignment = async (
  entityId: string,
  userId: string
): Promise<EntityAssignmentRecord> => {
  const query = `
    INSERT INTO entity_assignments (entity_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (entity_id)
    DO UPDATE SET user_id = EXCLUDED.user_id
    RETURNING entity_id, user_id, created_at
  `;

  const result = await pool.query<EntityAssignmentRecord>(query, [
    entityId,
    userId,
  ]);
  return result.rows[0];
};
