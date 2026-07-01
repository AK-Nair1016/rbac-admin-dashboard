import { Request, Response } from "express";
import { getAssignableUsers as getAssignableUsersService } from "../services/user.service";
import { sendSuccess } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * GET assignable users
 * Admin / Manager only
 * Used for entity assignment dropdown
 */
export const getAssignableUsers = asyncHandler(
  async (_req: Request, res: Response) => {
    const users = await getAssignableUsersService();

    return sendSuccess(res, {
      data: users,
    });
  }
);
