import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

// GET /protected
router.get(
  "/",
  authenticateJWT,
  (req, res) => {
    res.json({
      message: "You have accessed a protected route",
      user: (req as any).user,
    });
  }
);

export default router;
