import type { ResponseSignupSchema } from "./auth.schema.js";
import { sginupService } from "./auth.service.js";
import type { Request, Response, NextFunction } from "express";

export const sginupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, token } = await sginupService(req.body);

    const responseBody: ResponseSignupSchema = {
      message: "Success signup",
      data: {
        user: user,
        token: token,
      },
    };

    res.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
};
