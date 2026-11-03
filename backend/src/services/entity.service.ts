import {
  createEntityRecord,
  entityExists,
  EntityStatus,
  findEntityOwnership,
  findEntities,
  findEntitiesByOwner,
  findEntityById,
  updateEntityRecord,
  updateEntityStatusRecord,
  upsertEntityAssignment,
  userExists,
} from "../db/entity.queries";
import { logger } from "../utils/logger";

type ListQuery = {
  page?: unknown;
  limit?: unknown;
  search?: unknown;
  status?: unknown;
};

type CreateEntityInput = {
  name: string;
  status?: string;
  ownerId: string;
};

type UpdateEntityInput = {
  entityId: string;
  name?: string;
  status?: string;
};

type AssignEntityInput = {
  entityId: string;
  userId: string;
};

type OwnershipAccessResult = {
  allowed: boolean;
  statusCode?: 403 | 404;
  message?: string;
  ownerId?: string;
  ownerRole?: string;
};

const getPagination = (query: ListQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const getOptionalString = (value: unknown): string | undefined => {
  return typeof value === "string" ? value : undefined;
};

const normalizeStatus = (status?: string): EntityStatus => {
  return status === "ACTIVE" || status === "INACTIVE" ? status : "ACTIVE";
};

export const createEntityForOwner = async ({
  name,
  status,
  ownerId,
}: CreateEntityInput) => {
  const entity = await createEntityRecord(
    name.trim(),
    normalizeStatus(status),
    ownerId
  );

  logger.info(
    {
      event: "entity_created",
      entityId: entity.id,
      ownerId,
      status: entity.status,
    },
    "Entity created"
  );

  return entity;
};

export const listEntities = async (query: ListQuery) => {
  const { page, limit, offset } = getPagination(query);
  const { rows, total } = await findEntities(
    {
      status: getOptionalString(query.status),
      search: getOptionalString(query.search),
    },
    { limit, offset }
  );

  return {
    page,
    limit,
    total,
    data: rows,
  };
};

export const listEntitiesForOwner = async (
  ownerId: string,
  query: ListQuery
) => {
  const { page, limit, offset } = getPagination(query);
  const { rows, total } = await findEntitiesByOwner(
    ownerId,
    {
      search: getOptionalString(query.search),
    },
    { limit, offset }
  );

  return {
    page,
    limit,
    total,
    data: rows,
  };
};

export const getEntity = async (entityId: string) => {
  return findEntityById(entityId);
};

export const evaluateEntityOwnershipAccess = async (
  entityId: string,
  user: { userId: string; role: string }
): Promise<OwnershipAccessResult> => {
  const ownership = await findEntityOwnership(entityId);

  if (!ownership) {
    return {
      allowed: false,
      statusCode: 404,
      message: "Entity not found",
    };
  }

  if (user.role === "manager") {
    if (ownership.owner_role === "admin") {
      return {
        allowed: false,
        statusCode: 403,
        message: "Managers cannot access admin-owned entities",
        ownerRole: ownership.owner_role,
      };
    }

    return { allowed: true };
  }

  if (user.role === "user") {
    if (ownership.owner_id !== user.userId) {
      return {
        allowed: false,
        statusCode: 403,
        message: "Access denied",
        ownerId: ownership.owner_id,
      };
    }

    return { allowed: true };
  }

  return {
    allowed: false,
    statusCode: 403,
    message: "Access denied",
    ownerId: ownership.owner_id,
    ownerRole: ownership.owner_role,
  };
};

export const updateEntityDetails = async ({
  entityId,
  name,
  status,
}: UpdateEntityInput) => {
  const entity = await updateEntityRecord(entityId, { name, status });

  if (entity) {
    logger.info(
      {
        event: "entity_updated",
        entityId,
        status: entity.status,
      },
      "Entity updated"
    );
  }

  return entity;
};

export const updateEntityStatus = async (
  entityId: string,
  status: EntityStatus
) => {
  const entity = await updateEntityStatusRecord(entityId, status);

  if (entity) {
    logger.info(
      {
        event: "entity_status_updated",
        entityId,
        status,
      },
      "Entity status updated"
    );
  }

  return entity;
};

export const assignUserToEntityRecord = async ({
  entityId,
  userId,
}: AssignEntityInput) => {
  const hasEntity = await entityExists(entityId);

  if (!hasEntity) {
    return { error: "Entity not found" as const };
  }

  const hasUser = await userExists(userId);

  if (!hasUser) {
    return { error: "User not found" as const };
  }

  const assignment = await upsertEntityAssignment(entityId, userId);

  logger.info(
    {
      event: "entity_assignment_upserted",
      entityId,
      userId,
    },
    "Entity assignment saved"
  );

  return {
    assignment,
  };
};
