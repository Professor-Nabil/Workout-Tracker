import type { Request, Response, NextFunction } from "express";
import { readAllExerciseService } from "./exercise.service.js";

export const readAllExerciseController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await readAllExerciseService();

    const body = {
      message: "Success: read all exercise",
      data: {
        exercises: result,
      },
    };
    res.status(200).json(body);
  } catch (err) {
    next(err);
  }
};
