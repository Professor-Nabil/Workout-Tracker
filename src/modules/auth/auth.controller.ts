import { createUser, loginService } from "./auth.service.js";
import type { Request, Response, NextFunction } from "express";

export const singupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // -------------------------------------------------------------
    const { email, password } = req.body;
    // -------------------------------------------------------------
    const { user } = await createUser(email, password);
    // -------------------------------------------------------------
    const body = {
      message: "Success signup",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    };
    // -------------------------------------------------------------
    res.status(201).json(body);
    // -------------------------------------------------------------
  } catch (err) {
    next(err);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // -------------------------------------------------------------
    const { email, password } = req.body;
    // -------------------------------------------------------------
    const { user } = await loginService(email, password);
    // -------------------------------------------------------------
    const body = {
      message: "Success login",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    };
    // -------------------------------------------------------------
    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
};
