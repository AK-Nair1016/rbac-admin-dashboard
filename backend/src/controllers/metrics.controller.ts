import { Request, Response } from "express";
import {
  getTotalUsersCount,
  getTotalEntitiesCount,
  getEntitiesCountByOwner,
  getActiveEntitiesCountByOwner,
  getEntityStatusBreakdown, 
} from "../utils/userQueries";

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const { role, userId } = req.user!;

    if (role === "admin") {
  const totalUsers = await getTotalUsersCount();
  const totalEntities = await getTotalEntitiesCount();
  const statusBreakdown = await getEntityStatusBreakdown();

  return res.json({
    role,
    metrics: {
      totalUsers,
      totalEntities,
      systemRoles: 3,
    },
    charts: {
      entitiesByStatus: statusBreakdown,
    },
  });
}


    if (role === "manager") {
      const assignedEntities = await getEntitiesCountByOwner(userId);
      const activeEntities = await getActiveEntitiesCountByOwner(userId);

      return res.json({
        role,
        metrics: {
          assignedEntities,
          activeEntities,
        },
      });
    }

    if (role === "user") {
      const myEntities = await getEntitiesCountByOwner(userId);
      const activeEntities = await getActiveEntitiesCountByOwner(userId);

      return res.json({
        role,
        metrics: {
          myEntities,
          activeEntities,
        },
      });
    }

    return res.status(403).json({ message: "Invalid role" });
  } catch (error) {
    console.error("Metrics error:", error);
    return res.status(500).json({ message: "Failed to fetch metrics" });
  }
};
