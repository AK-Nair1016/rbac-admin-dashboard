import axios from "./axios";

export type PermissionType = "READ" | "WRITE" | "READ_WRITE";

export interface EntityPermission {
  entityId: string;
  permission: PermissionType;
}

export interface UpsertPermissionPayload {
  userId: string;
  entityId: string;
  permission: PermissionType;
}

// ✅ Logged-in user's permissions
export const getMyPermissions = async (): Promise<EntityPermission[]> => {
  const res = await axios.get("/permissions/me");
  return res.data;
};

// ✅ Admin / Manager
export const getAllPermissions = async () => {
  const res = await axios.get("/permissions");
  return res.data.data;
};

export const upsertPermission = async (
  payload: UpsertPermissionPayload
) => {
  const res = await axios.post("/permissions", payload);
  return res.data;
};


