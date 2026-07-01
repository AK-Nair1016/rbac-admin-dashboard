import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { logger } from "../utils/logger";
import { sendError } from "../utils/apiResponse";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      logger.warn(
        {
          event: "auth_header_missing",
          method: req.method,
          path: req.originalUrl,
        },
        "Authorization header missing"
      );

      return sendError(res, {
        statusCode: 401,
        message: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      logger.warn(
        {
          event: "auth_token_missing",
          method: req.method,
          path: req.originalUrl,
        },
        "JWT token missing"
      );

      return sendError(res, {
        statusCode: 401,
        message: "Token missing",
      });
    }

    const decoded = verifyToken(token);

    // Defensive check (important for security & stability)
    if (
      !decoded.userId ||
      !decoded.employeeId ||
      !decoded.role
    ) {
      logger.warn(
        {
          event: "auth_token_invalid_payload",
          method: req.method,
          path: req.originalUrl,
        },
        "Invalid token payload"
      );

      return sendError(res, {
        statusCode: 401,
        message: "Invalid token payload",
      });
    }

    // Attach typed user info to request
    req.user = {
      userId: decoded.userId,         // UUID (internal)
      employeeId: decoded.employeeId, // EID (human-facing)
      role: decoded.role,
    };
    next();
  } catch (error) {
    logger.warn(
      {
        event: "auth_token_verification_failed",
        method: req.method,
        path: req.originalUrl,
        error,
      },
      "Invalid or expired token"
    );

    return sendError(res, {
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }
};
