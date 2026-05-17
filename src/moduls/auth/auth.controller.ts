import type { ResponseSignupSchema } from "./auth.schema.js";
import { loginService, sginupService } from "./auth.service.js";
import type { Request, Response, NextFunction } from "express";

export const sginupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, token } = await sginupService(req.body);
    const { id, email } = user;

    const responseBody: ResponseSignupSchema = {
      message: "Success signup",
      data: {
        user: { id, email },
        token: token,
      },
    };

    res.status(201).json(responseBody);
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
    const { user, token } = await loginService(req.body);
    const { id, email } = user;

    const responseBody: ResponseSignupSchema = {
      message: "Success login",
      data: { user: { id, email }, token },
    };

    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};
