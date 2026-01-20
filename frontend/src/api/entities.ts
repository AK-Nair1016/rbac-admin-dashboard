// src/api/entities.ts
import axios from "./axios";

/* =========================
   TYPES
   ========================= */

export interface Entity {
  id: string;
  name: string;
  status: string;
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
          LIST APIs
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

/* =========================
   CREATE API
   ========================= */

export interface CreateEntityPayload {
  name: string;
  status?: string;
}

export const createEntity = async (
  payload: CreateEntityPayload
) => {
  const response = await axios.post("/entities", payload);
  return response.data;
};

/* =========================
   READ SINGLE ENTITY
   ========================= */

export const getEntityById = async (
  id: string
): Promise<Entity> => {
  const response = await axios.get(`/entities/${id}`);
  return response.data;
};

/* =========================
   UPDATE ENTITY
   ========================= */

export interface UpdateEntityPayload {
  name: string;
  status?: string;
}

export const updateEntity = async (
  id: string,
  payload: UpdateEntityPayload
): Promise<Entity> => {
  const response = await axios.put(`/entities/${id}`, payload);
  return response.data;
};