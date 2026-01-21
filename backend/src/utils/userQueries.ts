import pool from "../config/db";

/* =========================
   AUTH
   ========================= */

export const getUserByEmail = async (email: string) => {
  const query = `
    SELECT id, email, password, role, employee_id
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0];
};

/* =========================
   METRICS QUERIES
   ========================= */

export const getTotalUsersCount = async (): Promise<number> => {
  const result = await pool.query(`SELECT COUNT(*) FROM users`);
  return Number(result.rows[0].count);
};

export const getTotalEntitiesCount = async (): Promise<number> => {
  const result = await pool.query(`SELECT COUNT(*) FROM entities`);
  return Number(result.rows[0].count);
};

export const getEntitiesCountByOwner = async (
  ownerId: string
): Promise<number> => {
  const query = `
    SELECT COUNT(*)
    FROM entities
    WHERE owner_id = $1
  `;
  const result = await pool.query(query, [ownerId]);
  return Number(result.rows[0].count);
};

export const getActiveEntitiesCountByOwner = async (
  ownerId: string
): Promise<number> => {
  const query = `
    SELECT COUNT(*)
    FROM entities
    WHERE owner_id = $1
      AND status = 'ACTIVE'
  `;
  const result = await pool.query(query, [ownerId]);
  return Number(result.rows[0].count);
};
