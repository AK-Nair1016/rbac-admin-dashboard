import pool from "../config/db";

export const getUserByEmail = async (email: string) => {
  const query = `
    SELECT id, email, password, role
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};
