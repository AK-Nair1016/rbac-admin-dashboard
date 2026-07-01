import { Response } from "express";

type SuccessResponseOptions = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: unknown;
  dataKey?: string;
  extras?: Record<string, unknown>;
  payload?: unknown;
};

type ErrorResponseOptions = {
  statusCode: number;
  success?: boolean;
  message: string;
  errors?: unknown[];
  extras?: Record<string, unknown>;
  payload?: unknown;
};

export const sendSuccess = (
  res: Response,
  {
    statusCode = 200,
    success,
    message,
    data,
    dataKey = "data",
    extras = {},
    payload,
  }: SuccessResponseOptions
) => {
  if (payload !== undefined) {
    return res.status(statusCode).json(payload);
  }

  const responseBody: Record<string, unknown> = {
    ...extras,
  };

  if (success !== undefined) {
    responseBody.success = success;
  }

  if (message !== undefined) {
    responseBody.message = message;
  }

  if (data !== undefined) {
    responseBody[dataKey] = data;
  }

  return res.status(statusCode).json(responseBody);
};

export const sendError = (
  res: Response,
  {
    statusCode,
    success,
    message,
    errors,
    extras = {},
    payload,
  }: ErrorResponseOptions
) => {
  if (payload !== undefined) {
    return res.status(statusCode).json(payload);
  }

  const responseBody: Record<string, unknown> = {
    ...extras,
    message,
  };

  if (success !== undefined) {
    responseBody.success = success;
  }

  if (errors) {
    responseBody.errors = errors;
  }

  return res.status(statusCode).json(responseBody);
};
