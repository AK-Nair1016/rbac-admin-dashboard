import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export const notFoundHandler = (_req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isDev = process.env.NODE_ENV !== "production";

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON body",
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      ...(isDev && { stack: err.stack }),
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(isDev && { stack: err.stack }),
  });
};
