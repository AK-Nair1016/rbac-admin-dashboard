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
import { asyncHandler } from "../utils/asyncHandler";

const getEntityId = (req: Request) => String(req.params.id);

export const createEntity = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, status } = req.body;
    const entity = await createEntityForOwner({
      name,
      status,
      ownerId: req.user.userId,
    });

    return res.status(201).json({
      message: "Entity created successfully",
      data: entity,
    });
  }
);

export const getAllEntities = asyncHandler(
  async (req: Request, res: Response) => {
    const entities = await listEntities(req.query);

    return res.status(200).json(entities);
  }
);

export const getMyEntities = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user!;
    const entities = await listEntitiesForOwner(user.userId, req.query);

    return res.status(200).json(entities);
  }
);

export const getEntityById = asyncHandler(
  async (req: Request, res: Response) => {
    const entity = await getEntity(getEntityId(req));

    if (!entity) {
      return res.status(404).json({ message: "Entity not found" });
    }

    return res.status(200).json({
      entity,
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
      return res.status(404).json({ message: "Entity not found" });
    }

    return res.status(200).json({
      message: "Entity updated successfully",
      entity,
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
      return res.status(404).json({
        message: "Entity not found",
      });
    }

    return res.status(200).json({
      message: "Entity status updated successfully",
      entity,
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
      return res.status(404).json({
        message: result.error,
      });
    }

    return res.status(200).json({
      message: "User assigned to entity successfully",
      assignment: result.assignment,
    });
  }
);
