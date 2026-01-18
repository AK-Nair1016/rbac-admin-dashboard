// src/api/entities.ts
import axios from "./axios";

/* =========================
   TYPES
   ========================= */

export interface Entity {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface EntityQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

/* =========================
   LIST APIs (ONLY WHAT WE USE NOW)
   ========================= */

export const getAllEntities = async (
  params: EntityQueryParams = {}
): Promise<PaginatedResponse<Entity>> => {
  const response = await axios.get("/entities", { params });
  return response.data;
};

export const getMyEntities = async (
  params: EntityQueryParams = {}
): Promise<PaginatedResponse<Entity>> => {
  const response = await axios.get("/entities/my", { params });
  return response.data;
};
