import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const tokenSchema = z.object({
  refreshToken: z.string().min(1),
});
