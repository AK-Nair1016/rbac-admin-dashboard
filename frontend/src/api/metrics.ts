import axios from "./axios";

/* =========================
   TYPES
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

export type MetricsResponse =
  | { role: "admin"; metrics: AdminMetrics }
  | { role: "manager"; metrics: ManagerMetrics }
  | { role: "user"; metrics: UserMetrics };

/* =========================
   METRICS API
   ========================= */

export const getMetrics = async (): Promise<MetricsResponse> => {
  const response = await axios.get("/metrics");
  return response.data;
};
