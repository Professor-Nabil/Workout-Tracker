import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { AppError } from "../lib/errors.js";

export const authController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authService(email, password);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};
