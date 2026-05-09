import { z } from "zod";

export const exerciseCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});
