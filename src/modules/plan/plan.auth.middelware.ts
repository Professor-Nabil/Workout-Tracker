import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../../lib/env.schema.js";
import { AppError } from "../../errors/app.error.js";
import z from "zod";

// 1. Declare custom property typing for Express Request interface
interface CustomJwtPayload extends jwt.JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const planAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    // 2. Read the standard Authorization header
    const authHeader = req.headers.authorization;

    // Check if the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication token required", 401);
    }

    // Extract the raw token string
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError("Invalid authentication format", 401);
    }

    // 3. Verify the token and cast the inner payload structure safely
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET); // as CustomJwtPayload;

    // 4. Attach the user identity payload directly to the request cycle context
    req.user = z.object({ id: z.uuid() }).parse(decoded);
    console.log(req.user.id);
    // req.user = {
    //   id: decoded.id,
    // };

    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // 5. Fixed standard 401 status target fallback error handling
      next(new AppError("Invalid or expired session token", 401));
    } else {
      next(err);
    }
  }
};
