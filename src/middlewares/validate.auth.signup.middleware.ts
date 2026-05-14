import type { Request, Response, NextFunction } from "express";
import z from "zod";
import { AppError } from "../lib/app.error.js";

const signupSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email format"),
      password: z
        .string({ required_error: "Password is required" })
        .min(8, "Password must be at least 8 characters long"),
    })
    .strict(),
});

export const validateSignup = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    await signupSchema.parseAsync({
      body: req.body,
    });
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const formatedError = err.errors.map((err) => ({
        faild: err.path[1],
        message: err.message,
      }));
      return next(new AppError("Validation Failed", 400, formatedError));
    }
    next();
  }
};
