import type { Request, Response, NextFunction } from "express";
import z from "zod";
import { AppError } from "../lib/app.error.js";

const signupSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters long"),
  }),
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
      const message = err.errors.map((ex) => ex.message).join(", ");
      return next(new AppError(message, 400));
    }
    next();
  }
};
