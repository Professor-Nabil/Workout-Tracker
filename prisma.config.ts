// ./prisma.config.ts
import { env } from "./src/schemas/env.schema.js";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env?.DATABASE_URL,
  },
});
