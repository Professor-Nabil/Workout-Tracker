// ./src/schemas/env.schema.ts
import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .refine((url) => url.startsWith("mysql"), "Invalid URL format"),
  PORT: z.coerce.number(),
  JWT_SECRET: z.string().min(32),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(`Invalid Environment Variables: ${_env.error}`);
  process.exit(1);
}

export const env = _env.data;
