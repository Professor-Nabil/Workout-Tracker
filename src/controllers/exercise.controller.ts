import type { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service.js";
import { ExerciseService } from "../services/exercise.service.js";

const categoryService = new CategoryService();
const exerciseService = new ExerciseService();

export const listCategories = async (
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const categories = await categoryService.list();
  res.status(200).json(categories);
};

export const list = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const exercises = await exerciseService.list(req.user!.userId);
  res.status(200).json(exercises);
};

export const create = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const exercise = await exerciseService.create(req.user!.userId, req.body);
  res.status(201).json(exercise);
};

export const update = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const exercise = await exerciseService.update(req.params.id as string, req.user!.userId, req.body);
  res.status(200).json(exercise);
};

export const remove = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  await exerciseService.delete(req.params.id as string, req.user!.userId);
  res.status(200).json({ message: "Exercise deleted successfully" });
};
