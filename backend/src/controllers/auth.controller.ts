import { Request, Response } from "express";
import { loginUser } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { token, user } = await loginUser({ email, password });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user,
  });
});
