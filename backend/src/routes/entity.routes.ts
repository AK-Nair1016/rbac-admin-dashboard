import { Router } from "express";
import {
  createEntity,
  getAllEntities,
  getMyEntities,
  getEntityById,
  updateEntity,
  updateEntityStatus,
  assignUserToEntity // ✅ NEW
} from "../controllers/entity.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";
import { checkOwnership } from "../middleware/ownership.middleware";

const router = Router();

// CREATE entity
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  createEntity
);

// GET all entities (Admin, Manager)
router.get(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  getAllEntities
);

// GET my entities (User)
router.get(
  "/my",
  authenticateJWT,
  authorizeRoles("user"),
  getMyEntities
);

// GET entity by ID
router.get(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "manager", "user"),
  checkOwnership,
  getEntityById
);

// UPDATE entity (full update)
router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "manager", "user"),
  checkOwnership,
  updateEntity
);

// UPDATE ENTITY STATUS (INLINE TOGGLE)
router.patch(
  "/:id/status",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  updateEntityStatus
);

// ✅ ASSIGN USER TO ENTITY
router.post(
  "/:id/assign",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  assignUserToEntity
);

export default router;
