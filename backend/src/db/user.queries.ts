import pool from "../config/db";

export type AuthUserRecord = {
  id: string;
  email: string;
  password: string;
  role: string;
  employee_id: string | null;
};

export const findUserByEmail = async (
  email: string
): Promise<AuthUserRecord | undefined> => {
  const query = `
    SELECT id, email, password, role, employee_id
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query<AuthUserRecord>(query, [email]);
  return result.rows[0];
};
