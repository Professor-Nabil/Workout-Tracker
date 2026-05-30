import type { Request, Response, NextFunction } from "express";
import z from "zod";
import { AppError } from "../../errors/app.error.js";

const bodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const validateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req;
    bodySchema.parse(body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      err = new AppError("Bad Resuest", 400, err.issues);
      next(err);
    } else {
      next(err);
    }
  }
};
