import pool from "../config/db";

export type EntityStatusBreakdownRow = {
  status: string;
  count: number;
};

export const countUsers = async (): Promise<number> => {
  const result = await pool.query<{ count: string }>(`SELECT COUNT(*) FROM users`);
  return Number(result.rows[0].count);
};

export const countEntities = async (): Promise<number> => {
  const result = await pool.query<{ count: string }>(
    `SELECT COUNT(*) FROM entities`
  );
  return Number(result.rows[0].count);
};

export const countEntitiesByOwner = async (ownerId: string): Promise<number> => {
  const query = `
    SELECT COUNT(*)
    FROM entities
    WHERE owner_id = $1
  `;

  const result = await pool.query<{ count: string }>(query, [ownerId]);
  return Number(result.rows[0].count);
};

export const countActiveEntitiesByOwner = async (
  ownerId: string
): Promise<number> => {
  const query = `
    SELECT COUNT(*)
    FROM entities
    WHERE owner_id = $1
      AND status = 'ACTIVE'
  `;

  const result = await pool.query<{ count: string }>(query, [ownerId]);
  return Number(result.rows[0].count);
};

export const findEntityStatusBreakdown = async (): Promise<
  EntityStatusBreakdownRow[]
> => {
  const query = `
    SELECT status, COUNT(*)::int AS count
    FROM entities
    GROUP BY status
  `;

  const result = await pool.query<EntityStatusBreakdownRow>(query);
  return result.rows;
};
