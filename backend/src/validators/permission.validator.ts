import { NextFunction, Request, Response } from "express";
import type { PermissionValue } from "../db/permission.queries";

const VALID_PERMISSIONS: PermissionValue[] = ["READ", "WRITE", "READ_WRITE"];

export const validateUpsertPermissionRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, entityId, permission } = req.body;

  if (!userId || !entityId || !permission) {
    return res.status(400).json({
      message: "userId, entityId and permission are required",
    });
  }

  if (!VALID_PERMISSIONS.includes(permission)) {
    return res.status(400).json({ message: "Invalid permission value" });
  }

  return next();
};
