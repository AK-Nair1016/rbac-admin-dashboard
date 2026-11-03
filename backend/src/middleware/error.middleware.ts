import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { sendError } from "../utils/apiResponse";
import { logger } from "../utils/logger";

export const notFoundHandler = (_req: Request, res: Response) => {
  return sendError(res, {
    statusCode: 404,
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
  void _next;
  const isDev = process.env.NODE_ENV !== "production";

  if (err instanceof SyntaxError && "body" in err) {
    logger.warn(
      {
        event: "request_invalid_json",
        method: _req.method,
        path: _req.originalUrl,
      },
      "Invalid JSON body received"
    );

    return sendError(res, {
      statusCode: 400,
      success: false,
      message: "Invalid JSON body",
    });
  }

  if (err instanceof AppError) {
    const logMethod = err.statusCode >= 500 ? logger.error.bind(logger) : logger.warn.bind(logger);
    logMethod(
      {
        event: "application_error",
        statusCode: err.statusCode,
        method: _req.method,
        path: _req.originalUrl,
        err,
      },
      "Application error handled"
    );

    return sendError(res, {
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      errors: err.errors,
      extras: isDev ? { stack: err.stack } : undefined,
    });
  }

  logger.error(
    {
      event: "unexpected_error",
      method: _req.method,
      path: _req.originalUrl,
      err,
    },
    "Unexpected error handled"
  );

  return sendError(res, {
    statusCode: 500,
    success: false,
    message: err.message || "Internal Server Error",
    extras: isDev ? { stack: err.stack } : undefined,
  });
};
