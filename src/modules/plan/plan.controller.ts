import type { Request, Response, NextFunction } from "express";
import { planCreateService } from "./services/plan.create.service.js";
import z from "zod";
import { readOnePlanService } from "./services/read.one.plan.service.js";
import { AppError } from "../../errors/app.error.js";
import { readManyService } from "./services/read.many.service.js";
import { updatePlanService } from "./services/update.plan.service.js";
import { deleteService } from "../auth/serveces/delete.service.js";

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

export const readOneController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // -------------------------------------------------------------
    req.user = z.object({ id: z.uuid() }).parse(req.user);
    // -------------------------------------------------------------
    const result = await readOnePlanService(req.user.id, req.body.planId);
    // -------------------------------------------------------------
    if (!result) {
      throw new AppError("Plan not found", 404);
    }
    // -------------------------------------------------------------
    const body = {
      message: "Success read one plan",
      data: {
        user: {
          id: result.userId,
        },
        plan: result,
      },
    };

    // -------------------------------------------------------------
    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
};

export const readManyController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // -------------------------------------------------------------
    req.user = z.object({ id: z.uuid() }).parse(req.user);
    // -------------------------------------------------------------
    const result = await readManyService(req.user.id);
    // -------------------------------------------------------------
    const body = {
      message: "Success read many plans for one usre",
      data: {
        user: {
          id: result[0]?.userId,
        },
        plans: result,
      },
    };
    // -------------------------------------------------------------
    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
};

export const planUpdateController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // -------------------------------------------------------------
    req.user = z.object({ id: z.uuid() }).parse(req.user);
    // -------------------------------------------------------------
    const result = await updatePlanService(req.body);
    // -------------------------------------------------------------
    const body = {
      message: "Success read many plans for one usre",
      data: result,
    };
    // -------------------------------------------------------------
    res.status(200).json(body);
    // -------------------------------------------------------------
  } catch (err) {
    next(err);
  }
};

export const planDeleteController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // -------------------------------------------------------------
    let { planId } = req.params;
    // -------------------------------------------------------------
    planId = z.string().parse(planId);
    // -------------------------------------------------------------
    await deleteService(planId);
    // -------------------------------------------------------------
    res.sendStatus(204);
    // -------------------------------------------------------------
  } catch (err) {
    next(err);
  }
};
