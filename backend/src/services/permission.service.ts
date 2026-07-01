import {
  findAllPermissions,
  findPermissionsForUser,
  upsertEntityPermission,
} from "../db/permission.queries";
import type { PermissionValue } from "../db/permission.queries";

type SavePermissionInput = {
  userId: string;
  entityId: string;
  permission: PermissionValue;
};

export const getPermissionsForUser = async (userId: string) => {
  return findPermissionsForUser(userId);
};

export const getPermissions = async () => {
  return findAllPermissions();
};

export const savePermission = async ({
  userId,
  entityId,
  permission,
}: SavePermissionInput) => {
  return upsertEntityPermission(userId, entityId, permission);
};
