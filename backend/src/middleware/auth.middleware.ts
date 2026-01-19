import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
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
      return res.status(401).json({
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
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
