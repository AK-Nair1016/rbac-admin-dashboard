import { NextFunction, Request, Response } from "express";

export const validateGetAssignableUsersRequest = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  return next();
};
