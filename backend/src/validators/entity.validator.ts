import { NextFunction, Request, Response } from "express";

const hasBlankString = (value: unknown) => {
  return typeof value === "string" && value.trim() === "";
};

export const validateCreateEntityRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  if (!name || hasBlankString(name)) {
    return res.status(400).json({ message: "Name is required" });
  }

  return next();
};

export const validateUpdateEntityRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, status } = req.body;
  const hasNoValidName = name === undefined || hasBlankString(name);
  const hasNoValidStatus = status === undefined || hasBlankString(status);

  if (hasNoValidName && hasNoValidStatus) {
    return res.status(400).json({
      message: "At least one valid field must be provided",
    });
  }

  return next();
};

export const validateUpdateEntityStatusRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.body;

  if (status !== "ACTIVE" && status !== "INACTIVE") {
    return res.status(400).json({
      message: "Invalid status value",
    });
  }

  return next();
};

export const validateAssignUserToEntityRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  return next();
};
