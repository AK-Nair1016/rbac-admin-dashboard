import { Router } from "express";
import {
  createEntity,
  getAllEntities,
  getMyEntities,
  getEntityById,
  updateEntity,
  updateEntityStatus,
  assignUserToEntity,
} from "../controllers/entity.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";
import { checkOwnership } from "../middleware/ownership.middleware";
import {
  validateAssignUserToEntityRequest,
  validateCreateEntityRequest,
  validateUpdateEntityRequest,
  validateUpdateEntityStatusRequest,
} from "../validators/entity.validator";

const router = Router();

// CREATE entity
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  validateCreateEntityRequest,
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
  validateUpdateEntityRequest,
  updateEntity
);

// UPDATE ENTITY STATUS (INLINE TOGGLE)
router.patch(
  "/:id/status",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  validateUpdateEntityStatusRequest,
  updateEntityStatus
);

router.post(
  "/:id/assign",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  validateAssignUserToEntityRequest,
  assignUserToEntity
);

export default router;
