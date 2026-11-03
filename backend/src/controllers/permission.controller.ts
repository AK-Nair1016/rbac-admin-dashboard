import { Request, Response } from "express";
import {
  getPermissions,
  getPermissionsForUser,
  savePermission,
} from "../services/permission.service";
import { sendSuccess } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getMyPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const permissions = await getPermissionsForUser(userId);

    return sendSuccess(res, {
      payload: permissions,
    });
  }
);

export const getAllPermissions = asyncHandler(
  async (_req: Request, res: Response) => {
    const permissions = await getPermissions();

    return sendSuccess(res, {
      payload: permissions,
    });
  }
);

export const upsertPermission = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, entityId, permission } = req.body;
    const savedPermission = await savePermission({
      userId,
      entityId,
      permission,
    });

    return sendSuccess(res, {
      message: "Permission saved",
      data: savedPermission,
    });
  }
);
