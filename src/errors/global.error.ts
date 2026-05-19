import type { Request, Response, NextFunction } from "express";
import { AppError } from "./app.error.js";

export const globalError = async (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // -------------------------------------------------------------
  // If email already exists
  if (err.code === "P2002") {
    err = new AppError("Conflect Error", 409);
  }
  // -------------------------------------------------------------
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errors: err?.errors,
  });
};
