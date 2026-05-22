import { z } from "zod";

export const planSchema = z.object({
  title: z.string().min(3).max(100),
  planExercises: z
    .array(
      z.union([
        z.object({
          exerciseId: z.uuid(),
          weight: z.coerce.number().optional(),
          sets: z.coerce.number().optional(),
          reps: z.coerce.number().optional(),
          period: z.coerce.number().optional(),
        }),
      ]),
    )
    .min(1, "Include at least one exercise"),
});

export type PlanSchema = z.infer<typeof planSchema>;
