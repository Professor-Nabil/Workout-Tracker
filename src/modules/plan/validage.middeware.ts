import type { Request, Response, NextFunction } from "express";
import { planSchema } from "./plan.schema.js";
import z from "zod";
import { AppError } from "../../errors/app.error.js";

export const planValidateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = planSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      err = new AppError("Invalid plan", 400, err.issues);
      console.log(err);
      next(err);
    } else {
      console.log(err);
      next(err);
    }
  }
};
