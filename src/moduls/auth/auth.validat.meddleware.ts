import type { Request, Response, NextFunction } from "express";
import { userSchema } from "./auth.schema.js";
import { BadRequest } from "../../errors/app.error.js";

export const sginupValidateMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const validate = userSchema.safeParse(req.body);

  if (validate.success) return next();

  next(new BadRequest("Bad request", validate.error.issues));
};
