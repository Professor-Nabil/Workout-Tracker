import type { ResponseSignupSchema } from "./auth.schema.js";
import { loginService, sginupService } from "./auth.service.js";
import type { Request, Response, NextFunction } from "express";
import { refreshSessionService, logoutSessionService } from "./auth.service.js";
import { AppError } from "../../errors/app.error.js";

export const sginupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, accessToken, refreshToken } = await sginupService(req.body);
    const { id, email } = user;

    const responseBody: ResponseSignupSchema = {
      message: "Success signup",
      data: { user: { id, email }, accessToken, refreshToken },
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
    const { user, accessToken, refreshToken } = await loginService(req.body);
    const { id, email } = user;

    const responseBody: ResponseSignupSchema = {
      message: "Success login",
      data: { user: { id, email }, accessToken, refreshToken },
    };

    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
};

export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await refreshSessionService(refreshToken);

    res.status(200).json({
      message: "Tokens refreshed successfully",
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;

    await logoutSessionService(refreshToken);

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};
