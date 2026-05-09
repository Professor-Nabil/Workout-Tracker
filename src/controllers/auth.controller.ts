import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export const signup = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const { email, password } = req.body;
  const user = await authService.register(email, password);
  res.status(201).json({ userId: user.id });
};

export const login = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  const tokens = await authService.generateTokens(user.id);
  res.status(200).json(tokens);
};

export const refresh = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAccessToken(refreshToken);
  res.status(200).json(tokens);
};

export const logout = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const { refreshToken } = req.body;
  await authService.revokeRefreshToken(refreshToken);
  res.status(200).json({ message: "Logged out successfully" });
};
