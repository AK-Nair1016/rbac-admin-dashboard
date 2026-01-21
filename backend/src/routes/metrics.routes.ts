import express from "express";
import { getMetrics } from "../controllers/metrics.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticateJWT, getMetrics);

export default router;
