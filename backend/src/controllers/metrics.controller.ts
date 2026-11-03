import { Request, Response } from "express";
import { getDashboardMetrics } from "../services/dashboard.service";
import { sendError, sendSuccess } from "../utils/apiResponse";

export const getMetrics = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, {
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const metrics = await getDashboardMetrics({
      role: req.user.role,
      userId: req.user.userId,
    });

    if (!metrics) {
      return sendError(res, {
        statusCode: 403,
        message: "Invalid role",
      });
    }

    return sendSuccess(res, {
      payload: metrics,
    });
  } catch (error) {
    console.error("Metrics error:", error);
    return sendError(res, {
      statusCode: 500,
      message: "Failed to fetch metrics",
    });
  }
};
