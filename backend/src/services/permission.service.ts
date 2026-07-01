import {
  findAllPermissions,
  findPermissionsForUser,
  upsertEntityPermission,
} from "../db/permission.queries";
import type { PermissionValue } from "../db/permission.queries";
import { logger } from "../utils/logger";

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
  const permissionRecord = await upsertEntityPermission(
    userId,
    entityId,
    permission
  );

  logger.info(
    {
      event: "entity_permission_upserted",
      userId,
      entityId,
      permission,
    },
    "Entity permission saved"
  );

  return permissionRecord;
};
