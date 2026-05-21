import type { Request, Response, NextFunction } from "express";
import { planCreateService } from "./services/plan.create.service.js";

export const planController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // -------------------------------------------------------------
    const result = await planCreateService(req.body);
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
