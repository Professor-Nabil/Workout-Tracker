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
      message: "Success",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        token: token,
      },
    };

    res.status(201).json(body);
  } catch (err) {
    next(err);
  }
};
