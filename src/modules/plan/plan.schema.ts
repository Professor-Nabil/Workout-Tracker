import { z } from "zod";

// 1. Define the Resistance Exercise structure
const ResistanceExerciseSchema = z.object({
  exerciseId: z.uuid(),
  weight: z.number().positive(),
  sets: z.number().int().positive(),
  reps: z.number().int().positive(),
  period: z.undefined().optional(), // Explicitly blocked for clarity
});

// 2. Define the Cardio Exercise structure
const CardioExerciseSchema = z.object({
  exerciseId: z.uuid(),
  weight: z.undefined().optional(),
  sets: z.undefined().optional(),
  reps: z.undefined().optional(),
  period: z.number().positive(), // Minutes or seconds
});

// 3. Combine them using a standard union for the array items
const PlanExerciseItemSchema = z.union([
  ResistanceExerciseSchema,
  CardioExerciseSchema,
]);

// 4. Create the parent Request Body validation schema
export const CreateWorkoutPlanSchema = z.object({
  title: z.string().min(3).max(100),
  userId: z.uuid(),
  planExercises: z
    .array(PlanExerciseItemSchema)
    .min(1, "Include at least one exercise"),
});

// 5. Extract static TypeScript types using Zod 4 inference utilities
export type CreateWorkoutPlanInput = z.input<typeof CreateWorkoutPlanSchema>;
export type CreateWorkoutPlanOutput = z.infer<typeof CreateWorkoutPlanSchema>;
