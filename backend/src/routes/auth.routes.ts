import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { validateLoginRequest } from "../validators/auth.validator";

const router = Router();

router.post("/login", validateLoginRequest, login);

export default router;
