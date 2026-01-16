import { Router } from "express";
import {
  createEntity,
  getAllEntities,
  getMyEntities,
} from "../controllers/entity.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";

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

export default router;
