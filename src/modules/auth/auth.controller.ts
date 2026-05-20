import { signupService } from "./serveces/signup.service.js";
import { loginService } from "./serveces/login.service.js";
import type { Request, Response, NextFunction } from "express";
import { refreshService } from "./serveces/refresh.service.js";
import { logoutService } from "./serveces/logout.service.js";

export const singupController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // -------------------------------------------------------------
    const { email, password } = req.body;
    // -------------------------------------------------------------
    const { user } = await signupService(email, password);
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
    const { user, accessToken, refreshToken } = await loginService(
      email,
      password,
    );
    // -------------------------------------------------------------
    const body = {
      message: "Success login",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        accessToken,
        refreshToken,
      },
    };
    // -------------------------------------------------------------
    res.status(200).json(body);
    // -------------------------------------------------------------
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
    // -------------------------------------------------------------
    const incommingRefreshToken = req.body.refreshToken;
    // -------------------------------------------------------------
    const { accessToken, refreshToken } = await refreshService(
      incommingRefreshToken,
    );
    // -------------------------------------------------------------
    const body = {
      message: "Success refreshToken",
      data: {
        accessToken,
        refreshToken,
      },
    };
    // -------------------------------------------------------------
    res.status(200).json(body);
    // -------------------------------------------------------------
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
    const incommingRefreshToken = req.body.refreshToken;
    await logoutService(incommingRefreshToken);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
