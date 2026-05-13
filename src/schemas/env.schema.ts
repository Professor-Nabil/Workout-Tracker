/* ./src/schemas/env.schema.ts
 * Zod Schemas
 */
import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(`Invalid Environment Variables: ${_env.error.format()}`);
  process.exit(1);
}

export const env = _env.data;
