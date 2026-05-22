import type { Request, Response, NextFunction } from "express";
import { planCreateService } from "./services/plan.create.service.js";
import z from "zod";

export const planController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // -------------------------------------------------------------
    req.user = z.object({ id: z.uuid() }).parse(req.user);
    // -------------------------------------------------------------
    const result = await planCreateService(req.body, req.user.id);
    // -------------------------------------------------------------
    const body = {
      message: "Created plan succussfully",
      data: {
        userId: result.userId,
        planId: result.id,
      },
    };
    // -------------------------------------------------------------
    res.status(201).json(body);
  } catch (err) {
    next(err);
  }
};
