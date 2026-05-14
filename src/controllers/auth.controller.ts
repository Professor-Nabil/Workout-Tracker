// ./src/controllers/auth.controller.ts
import type { Request, Response, NextFunction } from "express";
import { signupService } from "../services/auth.service.js";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await signupService(email, password);

    const body = {
      message: "User created successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
        token: token,
      },
    };

    res.status(201).json(body);
  } catch (err) {
    next(err);
  }
};
