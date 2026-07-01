import { Request, Response } from "express";
import { loginUser } from "../services/auth.service";
import { sendSuccess } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { token, user } = await loginUser({ email, password });

  return sendSuccess(res, {
    success: true,
    message: "Login successful",
    extras: {
      token,
      user,
    },
  });
});
