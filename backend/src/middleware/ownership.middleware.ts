// import { Request, Response, NextFunction } from "express";
// import pool from "../config/db";

// export const checkOwnership = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user = (req as any).user;
//     const entityId = req.params.id;

//     if (!user || !entityId) {
//       return res.status(400).json({ message: "Invalid request" });
//     }

//     // Admin can access everything
//     if (user.role === "admin") {
//       return next();
//     }

//     // Fetch entity owner + owner role
//     const query = `
//       SELECT e.owner_id, u.role AS owner_role
//       FROM entities e
//       JOIN users u ON e.owner_id = u.id
//       WHERE e.id = $1
//     `;

//     const result = await pool.query(query, [entityId]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "Entity not found" });
//     }

//     const { owner_id, owner_role } = result.rows[0];

//     // Manager rules
//     if (user.role === "manager") {
//       if (owner_role === "admin") {
//         return res.status(403).json({
//           message: "Managers cannot access admin-owned entities",
//         });
//       }
//       return next(); // manager → user-owned or own entities
//     }

//     // User rules
//     if (user.role === "user") {
//       if (owner_id !== user.userId) {
//         return res.status(403).json({ message: "Access denied" });
//       }
//       return next();
//     }

//     return res.status(403).json({ message: "Access denied" });
//   } catch (error) {
//     console.error("OWNERSHIP CHECK ERROR:", error);
//     return res.status(500).json({ message: "Ownership check failed" });
//   }
// };



import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import { logger } from "../utils/logger";
import { sendError } from "../utils/apiResponse";

export const checkOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const entityId = req.params.id;

    // ✅ If no entityId, this is a list or non-entity route → skip
    if (!entityId) {
      return next();
    }

    if (!user) {
      logger.warn(
        {
          event: "authorization_ownership_missing_user",
          method: req.method,
          path: req.originalUrl,
        },
        "Ownership check attempted without authenticated user"
      );

      return sendError(res, {
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // ✅ Admin can access everything
    if (user.role === "admin") {
      return next();
    }

    // Fetch entity owner + owner role
    const query = `
      SELECT e.owner_id, u.role AS owner_role
      FROM entities e
      JOIN users u ON e.owner_id = u.id
      WHERE e.id = $1
    `;

    const result = await pool.query(query, [entityId]);

    if (result.rows.length === 0) {
      return sendError(res, {
        statusCode: 404,
        message: "Entity not found",
      });
    }

    const { owner_id, owner_role } = result.rows[0];

    // Manager rules
    if (user.role === "manager") {
      if (owner_role === "admin") {
        logger.warn(
          {
            event: "authorization_ownership_denied",
            userId: user.userId,
            role: user.role,
            entityId,
            ownerRole: owner_role,
            path: req.originalUrl,
          },
          "Manager blocked from admin-owned entity"
        );

        return sendError(res, {
          statusCode: 403,
          message: "Managers cannot access admin-owned entities",
        });
      }
      return next();
    }

    // User rules
    if (user.role === "user") {
      if (owner_id !== user.userId) {
        logger.warn(
          {
            event: "authorization_ownership_denied",
            userId: user.userId,
            role: user.role,
            entityId,
            ownerId: owner_id,
            path: req.originalUrl,
          },
          "User blocked from entity they do not own"
        );

        return sendError(res, {
          statusCode: 403,
          message: "Access denied",
        });
      }
      return next();
    }

    logger.warn(
      {
        event: "authorization_ownership_denied",
        userId: user.userId,
        role: user.role,
        entityId,
        path: req.originalUrl,
      },
      "Access denied by ownership rules"
    );

    return sendError(res, {
      statusCode: 403,
      message: "Access denied",
    });
  } catch (error) {
    logger.error(
      {
        event: "authorization_ownership_check_failed",
        path: req.originalUrl,
        error,
      },
      "Ownership check failed"
    );

    return sendError(res, {
      statusCode: 500,
      message: "Ownership check failed",
    });
  }
};
