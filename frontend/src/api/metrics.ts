import axios from "./axios";

/* =========================
   METRICS TYPES
   ========================= */

export interface AdminMetrics {
  totalUsers: number;
  totalEntities: number;
  systemRoles: number;
}

export interface ManagerMetrics {
  assignedEntities: number;
  activeEntities: number;
}

export interface UserMetrics {
  myEntities: number;
  activeEntities: number;
}

/* =========================
   CHART TYPES (ADMIN ONLY)
   ========================= */

export interface EntityStatusChartItem {
  status: string;
  count: number;
}

export interface AdminCharts {
  entitiesByStatus: EntityStatusChartItem[];
}

/* =========================
   API RESPONSE TYPE
   ========================= */

export type MetricsResponse =
  | {
      role: "admin";
      metrics: AdminMetrics;
      charts: AdminCharts;
    }
  | {
      role: "manager";
      metrics: ManagerMetrics;
    }
  | {
      role: "user";
      metrics: UserMetrics;
    };

/* =========================
   METRICS API
   ========================= */

export const getMetrics = async (): Promise<MetricsResponse> => {
  const response = await axios.get("/metrics");
  return response.data;
};
