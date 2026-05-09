import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors.js";
import logger from "../lib/logger.js";
import { env } from "../lib/env.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn(`Operational error: ${err.message}`, {
      statusCode: err.statusCode,
    });
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  logger.error(`Unexpected error: ${err.message}`, {
    stack: err.stack,
  });

  res.status(500).json({
    status: "error",
    message: "Internal server error",
    ...(env.NODE_ENV === "development" && { details: err.message }),
  });
};
