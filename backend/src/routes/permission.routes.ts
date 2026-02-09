import { Router } from "express";
import {
  getAllPermissions,
  upsertPermission,
} from "../controllers/permission.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";

const router = Router();

// View permissions
router.get(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  getAllPermissions
);

// Create / update permission
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  upsertPermission
);

export default router;
