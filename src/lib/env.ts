import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  PORT: z.coerce.number().min(1).default(3000),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.log("Missing .env file", env.error.issues);
  process.exit(1);
}

export default env.data;
