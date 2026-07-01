import { Router } from "express";
import { getAssignableUsers } from "../controllers/users.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/rbac.middleware";
import { validateGetAssignableUsersRequest } from "../validators/user.validator";

const router = Router();

// GET assignable users
router.get(
  "/assignable",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  validateGetAssignableUsersRequest,
  getAssignableUsers
);

export default router;
