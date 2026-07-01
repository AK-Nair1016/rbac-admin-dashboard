import {
  countActiveEntitiesByOwner,
  countEntities,
  countEntitiesByOwner,
  countUsers,
  findEntityStatusBreakdown,
} from "../db/dashboard.queries";

type DashboardMetricsInput = {
  role: string;
  userId: string;
};

type AdminDashboardResponse = {
  role: "admin";
  metrics: {
    totalUsers: number;
    totalEntities: number;
    systemRoles: number;
  };
  charts: {
    entitiesByStatus: Awaited<ReturnType<typeof findEntityStatusBreakdown>>;
  };
};

type ManagerDashboardResponse = {
  role: "manager";
  metrics: {
    assignedEntities: number;
    activeEntities: number;
  };
};

type UserDashboardResponse = {
  role: "user";
  metrics: {
    myEntities: number;
    activeEntities: number;
  };
};

export type DashboardMetricsResponse =
  | AdminDashboardResponse
  | ManagerDashboardResponse
  | UserDashboardResponse;

const SYSTEM_ROLE_COUNT = 3;

export const getDashboardMetrics = async ({
  role,
  userId,
}: DashboardMetricsInput): Promise<DashboardMetricsResponse | undefined> => {
  if (role === "admin") {
    const [totalUsers, totalEntities, statusBreakdown] = await Promise.all([
      countUsers(),
      countEntities(),
      findEntityStatusBreakdown(),
    ]);

    return {
      role,
      metrics: {
        totalUsers,
        totalEntities,
        systemRoles: SYSTEM_ROLE_COUNT,
      },
      charts: {
        entitiesByStatus: statusBreakdown,
      },
    };
  }

  if (role === "manager") {
    const [assignedEntities, activeEntities] = await Promise.all([
      countEntitiesByOwner(userId),
      countActiveEntitiesByOwner(userId),
    ]);

    return {
      role,
      metrics: {
        assignedEntities,
        activeEntities,
      },
    };
  }

  if (role === "user") {
    const [myEntities, activeEntities] = await Promise.all([
      countEntitiesByOwner(userId),
      countActiveEntitiesByOwner(userId),
    ]);

    return {
      role,
      metrics: {
        myEntities,
        activeEntities,
      },
    };
  }

  return undefined;
};
