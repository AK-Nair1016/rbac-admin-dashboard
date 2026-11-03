import axios from "./axios";

/* ===============================
   Permission Types
   =============================== */
export type PermissionType = "NONE" | "READ" | "WRITE" | "READ_WRITE";

/* ===============================
   Admin / Manager permission row
   =============================== */
export interface PermissionRow {
  userId: string;
  entityId: string;
  userEmail: string;
  entityName: string;
  permission: PermissionType;
}

/* ===============================
   Logged-in user's permissions
   =============================== */
export interface EntityPermission {
  entityId: string;
  permission: PermissionType;
}

/* ===============================
   Upsert payload
   =============================== */
export interface UpsertPermissionPayload {
  userId: string;
  entityId: string;
  permission: PermissionType;
}

/* ===============================
   Logged-in user's permissions
   =============================== */
export const getMyPermissions = async (): Promise<EntityPermission[]> => {
  const res = await axios.get<EntityPermission[]>("/permissions/me");
  return res.data;
};

/* ===============================
   Admin / Manager permissions
   =============================== */
export const getAllPermissions = async (): Promise<PermissionRow[]> => {
  const res = await axios.get<PermissionRow[]>("/permissions");
  return res.data;
};

/* ===============================
   Upsert permission
   =============================== */
export const upsertPermission = async (
  payload: UpsertPermissionPayload
) => {
  const res = await axios.post("/permissions", payload);
  return res.data;
};
