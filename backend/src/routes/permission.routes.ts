import { Router } from "express";
import {
  getAllPermissions,
  upsertPermission,
  getMyPermissions,
} from "../controllers/permission.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";
import { validateUpsertPermissionRequest } from "../validators/permission.validator";

const router = Router();

// USER → own permissions
router.get("/me", authenticateJWT, getMyPermissions);

// ADMIN / MANAGER → list all
router.get(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  getAllPermissions
);

// ADMIN / MANAGER → upsert
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  validateUpsertPermissionRequest,
  upsertPermission
);

export default router;
