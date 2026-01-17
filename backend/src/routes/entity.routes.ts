import { Router } from "express";
import {
  createEntity,
  getAllEntities,
  getMyEntities,
  getEntityById,
  updateEntity
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
//GET entities by ID
router.get(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "manager", "user"),
  checkOwnership,
  getEntityById
);

router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "manager", "user"),
  checkOwnership,
  updateEntity
);

export default router;
