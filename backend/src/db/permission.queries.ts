import pool from "../config/db";

export type PermissionValue = "READ" | "WRITE" | "READ_WRITE";

export type UserPermissionRow = {
  entityId: string;
  permission: PermissionValue | "NONE";
};

export type PermissionListRow = {
  userId: string;
  entityId: string;
  userEmail: string;
  entityName: string;
  permission: PermissionValue | "NONE";
};

export type PermissionRecord = {
  user_id: string;
  entity_id: string;
  permission: PermissionValue;
  created_at?: Date;
  updated_at?: Date;
};

export type EntityPermissionLookupRow = {
  permission: PermissionValue;
};

export const findPermissionsForUser = async (
  userId: string
): Promise<UserPermissionRow[]> => {
  const query = `
    SELECT
      ea.entity_id AS "entityId",
      COALESCE(ep.permission, 'NONE') AS permission
    FROM entity_assignments ea
    LEFT JOIN entity_permissions ep
      ON ep.user_id = ea.user_id
     AND ep.entity_id = ea.entity_id
    WHERE ea.user_id = $1
  `;

  const result = await pool.query<UserPermissionRow>(query, [userId]);
  return result.rows;
};

export const findAllPermissions = async (): Promise<PermissionListRow[]> => {
  const query = `
    SELECT
      ea.user_id    AS "userId",
      ea.entity_id  AS "entityId",
      u.email       AS "userEmail",
      e.name        AS "entityName",
      COALESCE(ep.permission, 'NONE') AS "permission"
    FROM entity_assignments ea
    JOIN users u ON u.id = ea.user_id
    JOIN entities e ON e.id = ea.entity_id
    LEFT JOIN entity_permissions ep
      ON ep.user_id = ea.user_id
     AND ep.entity_id = ea.entity_id
    ORDER BY u.email, e.name
  `;

  const result = await pool.query<PermissionListRow>(query);
  return result.rows;
};

export const upsertEntityPermission = async (
  userId: string,
  entityId: string,
  permission: PermissionValue
): Promise<PermissionRecord> => {
  const query = `
    INSERT INTO entity_permissions (user_id, entity_id, permission)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, entity_id)
    DO UPDATE SET permission = EXCLUDED.permission
    RETURNING *
  `;

  const result = await pool.query<PermissionRecord>(query, [
    userId,
    entityId,
    permission,
  ]);
  return result.rows[0];
};

export const findEntityPermissionForUser = async (
  userId: string,
  entityId: string
): Promise<PermissionValue | undefined> => {
  const query = `
    SELECT permission
    FROM entity_permissions
    WHERE user_id = $1 AND entity_id = $2
  `;

  const result = await pool.query<EntityPermissionLookupRow>(query, [
    userId,
    entityId,
  ]);

  return result.rows[0]?.permission;
};
