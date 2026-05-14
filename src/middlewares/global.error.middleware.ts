// ./src/middlewares/global.error.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/app.error.js";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.code === "P2002") {
    err = new AppError("Email already exists", 409);
    // │   └╴  Expected 3 arguments, but got 2. ts (2554) [15, 11]
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errors: err.errors || undefined,
  });
};
