import type { Request, Response, NextFunction } from "express";
import type { SginupResponseSchema } from "../schemas/response/auth/signup.schema.js";
import { signupService } from "../services/auth.service.js";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await signupService(email, password);

    const resData: SginupResponseSchema = {
      status: 201,
      body: {
        message: "Success",
        data: { user, token },
      },
    };

    res.status(resData.status).json(resData.body);
  } catch (err) {
    next(err);
  }
};
