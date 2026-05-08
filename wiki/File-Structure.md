# File Structure

This document outlines the project file structure, following a modular, scalable architecture.

## Project Root

- `prisma/`: Prisma schema and seeding scripts.
- `src/`: Core source code.
- `wiki/`: Project documentation.
- `.env`: Environment variables (not committed).
- `.env.example`: Template for environment variables.
- `package.json`: Project metadata and dependencies.
- `tsconfig.json`: TypeScript configuration.

## `src/` Directory

- `controllers/`: Request handling and response mapping.
- `generated/`: Prisma generated client.
- `lib/`: Shared utility libraries (e.g., `db.ts`, `logger.ts`, `env.ts`).
- `middlewares/`: Express middleware (auth, error handling, logging).
- `routes/`: API route definitions.
- `services/`: Business logic layer.
- `types/`: Shared TypeScript type definitions.
- `app.ts`: Express application configuration.
- `server.ts`: Entry point for server startup.

## Development Standards

- **Modular Imports**: Keep domain logic within their respective folders.
- **Strict Typing**: Use `src/types/` for cross-module shared types.
- **Layering**: Controllers should only call services; services should only interact with the database via Prisma client.
