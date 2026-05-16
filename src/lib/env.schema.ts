import { el } from "@faker-js/faker";
import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .refine((url) => url.startsWith("mysql://")),
  PORT: z.coerce.number(),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "test", "production"]),
});

const envData = envSchema.safeParse(process.env);

if (!envData.success) {
  const message = envData.error.issues.map((elm) => {
    return { path: elm.path, message: elm.message };
  });
  console.log("Missing .env:\n", message);
  process.exit(1);
}

const env = envData.data;

export default env;
