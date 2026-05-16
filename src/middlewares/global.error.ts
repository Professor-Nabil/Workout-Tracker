import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../lib/app.error.js";

export const globalErrorMiddleware = async (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      err = new AppError("User already exists", 409);
    }
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errors: err?.errors,
  });
};
