// ./src/middlewares/global.error.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/app.error.js";

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {

  // Handl syntax errors (like JSON)
  if (err instanceof SyntaxError && "body" in err) {
    err = new AppError("Maiformed JSON: Please check your syntax", 400)
  }

  // 2. Handle Prisma Errors
  if (err.code === "P2002") {
    err = new AppError("Email already exists", 409);
  }

  // Fallback
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    errors: err.errors || undefined,
  });
};
