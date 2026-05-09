import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/env.js";
import { AuthenticationError } from "../lib/errors.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
    };
  }
}

export const auth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthenticationError("Missing or invalid authorization header");
  }

  const token = authHeader.split(" ")[1] ?? "";

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as Record<string, unknown>;
    if (typeof payload.userId !== "string") {
      throw new Error();
    }
    req.user = { userId: payload.userId };
    next();
  } catch {
    throw new AuthenticationError("Invalid or expired token");
  }
};
