import { z } from "zod";

export const exerciseCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

export const createExerciseSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  muscleGroup: z.string().optional(),
});

export const updateExerciseSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  muscleGroup: z.string().optional(),
});
