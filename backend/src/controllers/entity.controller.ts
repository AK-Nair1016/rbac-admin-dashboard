import { Request, Response } from "express";
import type { EntityStatus } from "../db/entity.queries";
import {
  assignUserToEntityRecord,
  createEntityForOwner,
  getEntity,
  listEntities,
  listEntitiesForOwner,
  updateEntityDetails,
  updateEntityStatus as updateEntityStatusService,
} from "../services/entity.service";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const getEntityId = (req: Request) => String(req.params.id);

export const createEntity = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, {
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const { name, status } = req.body;
    const entity = await createEntityForOwner({
      name,
      status,
      ownerId: req.user.userId,
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: "Entity created successfully",
      data: entity,
    });
  }
);

export const getAllEntities = asyncHandler(
  async (req: Request, res: Response) => {
    const entities = await listEntities(req.query);

    return sendSuccess(res, {
      payload: entities,
    });
  }
);

export const getMyEntities = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;
    const entities = await listEntitiesForOwner(user.userId, req.query);

    return sendSuccess(res, {
      payload: entities,
    });
  }
);

export const getEntityById = asyncHandler(
  async (req: Request, res: Response) => {
    const entity = await getEntity(getEntityId(req));

    if (!entity) {
      return sendError(res, {
        statusCode: 404,
        message: "Entity not found",
      });
    }

    return sendSuccess(res, {
      extras: {
        entity,
      },
    });
  }
);

export const updateEntity = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, status } = req.body;
    const entity = await updateEntityDetails({
      entityId: getEntityId(req),
      name,
      status,
    });

    if (!entity) {
      return sendError(res, {
        statusCode: 404,
        message: "Entity not found",
      });
    }

    return sendSuccess(res, {
      message: "Entity updated successfully",
      extras: {
        entity,
      },
    });
  }
);

export const updateEntityStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const entity = await updateEntityStatusService(
      getEntityId(req),
      req.body.status as EntityStatus
    );

    if (!entity) {
      return sendError(res, {
        statusCode: 404,
        message: "Entity not found",
      });
    }

    return sendSuccess(res, {
      message: "Entity status updated successfully",
      extras: {
        entity,
      },
    });
  }
);

export const assignUserToEntity = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await assignUserToEntityRecord({
      entityId: getEntityId(req),
      userId: req.body.userId,
    });

    if ("error" in result) {
      return sendError(res, {
        statusCode: 404,
        message: result.error,
      });
    }

    return sendSuccess(res, {
      message: "User assigned to entity successfully",
      extras: {
        assignment: result.assignment,
      },
    });
  }
);
