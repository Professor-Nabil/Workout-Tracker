import type { Request, Response, NextFunction } from "express";
import { AppError } from "./app.error.js";
import { Prisma } from "../generated/prisma/client.js";

export const globalError = async (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // -------------------------------------------------------------
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // If email already exists
    if (err.code === "P2002") {
      err = new AppError("Conflect Error", 409);
    } else {
      err = new AppError("Error from Database Prisma", 500);
    }
  }
  // -------------------------------------------------------------
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errors: err?.errors,
  });
};
