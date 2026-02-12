// src/api/entities.ts
import axios from "./axios";

/* =========================
   TYPES
   ========================= */

export interface Entity {
  id: string;
  name: string;
  status: "ACTIVE"| "INACTIVE";
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

// export const getAllEntities = async (
//   params: EntityQueryParams = {}
// ): Promise<PaginatedResponse<Entity>> => {
//   const response = await axios.get("/entities", { params });
//   return response.data;
// };

export const getAllEntities = async ({
  page,
  limit,
  search,
  status,
}: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}) => {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));

  if (search) params.append("search", search);
  if (status) params.append("status", status);

  const res = await axios.get(`/entities?${params.toString()}`);
  return res.data;
};


export const getMyEntities = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));

  if (search) params.append("search", search);

  const res = await axios.get(`/entities/my?${params.toString()}`);
  return res.data;
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
/* =========================
   UPDATE ENTITY STATUS (INLINE TOGGLE)
   ========================= */

export const updateEntityStatus = async (
  id: string,
  status: "ACTIVE" | "INACTIVE"
): Promise<Entity> => {
  const response = await axios.patch(`/entities/${id}/status`, {
    status,
  });
  return response.data;
};
/* =========================
   USER ASSIGNMENT (STEP 2)
   ========================= */

export interface AssignableUser {
  id: string;
  email: string;
  employee_id: string;
}

/**
 * Get users that can be assigned to entities
 * Admin / Manager only
 */
export const getAssignableUsers = async (): Promise<AssignableUser[]> => {
  const response = await axios.get("/users/assignable");
  return response.data.data;
};

/**
 * Assign a user to an entity
 * Admin / Manager only
 */
export const assignUserToEntity = async (
  entityId: string,
  userId: string
) => {
  const response = await axios.post(`/entities/${entityId}/assign`, {
    userId,
  });
  return response.data;
};
