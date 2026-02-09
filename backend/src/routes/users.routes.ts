import { Router } from "express";
import { getAssignableUsers } from "../controllers/users.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";

const router = Router();

// GET assignable users
router.get(
  "/assignable",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  getAssignableUsers
);

export default router;
