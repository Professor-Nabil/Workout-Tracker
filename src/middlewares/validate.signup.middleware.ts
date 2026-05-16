import type { Request, Response, NextFunction } from "express";
import { sginupBodytSchema } from "../schemas/request/auth/signup.schema.js";
import z from "zod";
import { AppError } from "../lib/app.error.js";

export const validateSignupMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    sginupBodytSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.issues.map((e) => {
        return {
          path: e.path,
          message: e.message,
        };
      });

      err = new AppError("Validation fail", 400, errors);
    }

    next(err);
  }
};
