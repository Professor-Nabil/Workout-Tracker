import type { Request, Response, NextFunction } from "express";
import { ConflictError } from "./app.error.js";

const globalError = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.code === "P2002") {
    err = new ConflictError("Data already exists");
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errors: err?.errors,
  });
};

export default globalError;
