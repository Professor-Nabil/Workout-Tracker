import type { Request, Response, NextFunction } from "express";
import { WorkoutService } from "../services/workout.service.js";

const workoutService = new WorkoutService();

export const create = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const { title, scheduledAt } = req.body;
  const workout = await workoutService.create({
    title,
    scheduledAt,
    userId: req.user!.userId,
  });
  res.status(201).json(workout);
};

export const list = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const workouts = await workoutService.list(req.user!.userId);
  res.status(200).json(workouts);
};

export const getById = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const workout = await workoutService.getById(req.params.id as string, req.user!.userId);
  res.status(200).json(workout);
};

export const update = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const workout = await workoutService.update(req.params.id as string, req.user!.userId, req.body);
  res.status(200).json(workout);
};

export const softDelete = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  await workoutService.softDelete(req.params.id as string, req.user!.userId);
  res.status(200).json({ message: "Workout deleted successfully" });
};

export const addExercise = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const workoutExercise = await workoutService.addExercise(
    req.params.workoutId as string,
    req.user!.userId,
    req.body,
  );
  res.status(201).json(workoutExercise);
};

export const removeExercise = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  await workoutService.removeExercise(
    req.params.workoutExerciseId as string,
    req.user!.userId,
  );
  res.status(200).json({ message: "Exercise removed successfully" });
};

export const updateExerciseStatus = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const workoutExercise = await workoutService.updateExerciseStatus(
    req.params.workoutExerciseId as string,
    req.user!.userId,
    req.body.isCompleted,
  );
  res.status(200).json(workoutExercise);
};

export const reorderExercises = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  await workoutService.reorderExercises(
    req.params.workoutId as string,
    req.user!.userId,
    req.body.exercises,
  );
  res.status(200).json({ message: "Exercises reordered successfully" });
};
