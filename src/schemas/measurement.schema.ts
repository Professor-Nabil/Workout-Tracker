import { z } from "zod";

export const createMeasurementSchema = z.object({
  weight: z.number().positive(),
  date: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const updateMeasurementSchema = z.object({
  weight: z.number().positive().optional(),
  date: z.coerce.date().optional(),
  notes: z.string().optional(),
});
