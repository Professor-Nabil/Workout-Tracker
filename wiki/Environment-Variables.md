# Environment Variables

This document defines the required environment variables for the application.
We use `dotenv` for loading variables and `zod` for runtime validation.

## Required Variables

| Variable             | Description                           | Example                                           |
| :------------------- | :------------------------------------ | :------------------------------------------------ |
| `PORT`               | Port for the API server               | `3000`                                            |
| `DATABASE_URL`       | MariaDB connection string (Prisma)    | `mysql://user:password@localhost:3306/workout_db` |
| `JWT_ACCESS_SECRET`  | Secret key for signing access tokens  | `your_long_random_string`                         |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens | `your_long_random_secret`                         |
| `NODE_ENV`           | Application environment               | `development` / `production`                      |

## Implementation Guidelines

1. **Validation**:
   Use `zod` to define a schema in a configuration file (e.g., `src/lib/env.ts`)
   to validate all environment variables on application startup.

2. **Safety**: Never commit `.env` files. Use `.env.example` as a template for team members.

3. **Typing**:
   Ensure the validated environment variables are exported
   as a typed object for use throughout the application.

### Zod Validation Pattern Example

```typescript
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

export const env = envSchema.parse(process.env);
```
