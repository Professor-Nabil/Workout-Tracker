import { z } from "zod";
import { WorkoutStatus } from "../generated/client/enums.js";

export const createWorkoutSchema = z.object({
  title: z.string().min(1),
  scheduledAt: z.coerce.date(),
});

export const updateWorkoutSchema = z.object({
  title: z.string().min(1).optional(),
  scheduledAt: z.coerce.date().optional(),
  status: z.nativeEnum(WorkoutStatus).optional(),
  comments: z.string().optional(),
});

export const addExerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  sequence: z.number().int().positive(),
  sets: z.number().int().positive().optional(),
  reps: z.number().int().positive().optional(),
  weight: z.number().positive().optional(),
  duration: z.number().positive().optional(),
});

export const updateExerciseStatusSchema = z.object({
  isCompleted: z.boolean(),
});

export const reorderExercisesSchema = z.object({
  exercises: z.array(
    z.object({
      workoutExerciseId: z.string().uuid(),
      newSequence: z.number().int().positive(),
    }),
  ),
});
