import { signupService } from "./services/signup.service.js";
import { loginService } from "./services/login.service.js";
import type { Request, Response, NextFunction } from "express";
import { refreshService } from "./services/refresh.service.js";
import { logoutService } from "./services/logout.service.js";

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
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Protects against XSS attacks
      secure: process.env.NODE_ENV === "production", // Requires HTTPS in production
      sameSite: "strict", // Protects against CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration matching your JWT config
    });
    // -------------------------------------------------------------
    const body = {
      message: "Success login",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        accessToken,
        // refreshToken,
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
    const incommingRefreshToken = req.cookies.refreshToken;
    if (!incommingRefreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }
    // -------------------------------------------------------------
    const { accessToken, refreshToken } = await refreshService(
      incommingRefreshToken,
    );
    // -------------------------------------------------------------
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Protects against XSS attacks
      secure: process.env.NODE_ENV === "production", // Requires HTTPS in production
      sameSite: "strict", // Protects against CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration matching your JWT config
    });
    // -------------------------------------------------------------
    const body = {
      message: "Success refreshToken",
      data: {
        accessToken,
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
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (incomingRefreshToken) {
      await logoutService(incomingRefreshToken);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
