import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ValidationError } from "../lib/errors.js";

export interface ValidationSchema {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

export const validate = (schema: ValidationSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.query = schema.query.parse(req.query) as any;
      }
      if (schema.params) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.params = schema.params.parse(req.params) as any;
      }
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const message = err.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
        next(new ValidationError(message));
      } else {
        next(err);
      }
    }
  };
};
