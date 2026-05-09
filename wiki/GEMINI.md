# GEMINI.md

This file serves as the context source for Gemini CLI agents to maintain project consistency throughout the development lifecycle.

## Project Overview

- **Project**: Workout Tracker (Backend API)
- **Objective**: Track user workouts, progress, and generate analytics.
- **Architecture**: Modular, service-oriented Express API with Prisma/MariaDB.
- **Philosophy**: Terminal-first, TDD-driven, strict typing.

## Key References

- **Models**: Defined in `wiki/Models.md`, documented in `wiki/Models-Docs.md`.
- **API**: Endpoints in `wiki/API-Docs.md`, Schemas in `wiki/API-Schema.md`.
- **Database**: Seeding strategy in `wiki/Database-Seeding.md`.
- **Configuration**: Environment variables in `wiki/Environment-Variables.md`.
- **Tech Stack**: Technologies and patterns in `wiki/TECH.md`.
- **Testing**: Hierarchy, TDD protocol, and utilities in `wiki/Testing-Strategy.md`.
- **Logging**: Winston-based strategy in `wiki/Logging-Strategy.md`.
- **File Structure**: Defined in `wiki/File-Structure.md`.

## Development Principles

1. **TDD First**: Every feature begins with a failing test in `vitest`.
2. **Type Safety**: Use `zod` for request validation and Prisma/TypeScript for type-safe database interactions.
3. **Error Handling**: Use centralized `AppError` middleware.
4. **Logging**: Maintain structured JSON logs; PII must be redacted.
5. **Git Workflow**: Descriptive commit messages.
6. **Environment**: Validate via `zod` on startup.
- **Quality Control**: **EVERY TIME after you write or modify any code, you MUST run `npm run lint && npm run check && npm test` to ensure stability and quality.**
- **Imports**: ALWAYS add `.js` at the end of relative file imports (e.g., `import { ... } from "../lib/db.js";`).
- **Type Imports**: ALWAYS import types from the generated client using `import type { ... } from "../../src/generated/client/client.js";`.
- **Transactional Integrity**: ALWAYS use `prisma.$transaction` for multi-step database writes to ensure atomic consistency.
- **Service Design**: ALWAYS design services to be stateless; prioritize dependency injection/isolation and avoid circular dependencies.
- **Data Access Patterns**: When implementing services involving user-owned data, ALWAYS include owner ID checks (or `OR: [{ isSystem: true }, { ownerId: userId }]` for shared resources) to prevent unauthorized access.
- **Prisma Type Safety**: ALWAYS use `?? null` or explicit nullability handling when assigning optional input properties to Prisma model inputs to satisfy `exactOptionalPropertyTypes` constraints.
- **Testing**: When mocking Prisma services in `vitest`, ALWAYS ensure that all used methods (e.g., `findFirst`, `update`) are explicitly defined in the `vi.mock` factory object to avoid `undefined` reference errors. NEVER use `as any` for type casting in tests unless absolutely necessary for complex Prisma-generated types; if required, use `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with an explicit explanation, but strive to define complete mock objects matching the expected type.
- **Middleware Testing**: ALWAYS unit test critical middleware (Error Handler, Auth, Validation) by mocking `Request`, `Response`, and `NextFunction` objects.
- **Error Handler Signature**: Express error handlers MUST use the 4-argument signature `(err, req, res, next)` to be correctly registered by Express. Prefix unused arguments with `_` to satisfy linting rules.
- **Middleware Validation**: ALWAYS use `zod` schemas to validate `req.body`, `req.query`, and `req.params`. For necessary type casting (like `as any`) when overriding Express types, use `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with a clear explanation.
- **Express Request Augmentation**: ALWAYS use `declare module "express-serve-static-core"` for augmenting the Express `Request` type for custom middleware properties like `user`.
- **Thin Controllers**: Controllers MUST act as thin orchestrators. They should only extract validated request data, call the appropriate service method, and send the response. They must NOT contain business logic.
- **Service Patterns**: For any CRUD entity, ALWAYS implement `list` and `getById` methods as standard read operations.
- **Thin Controllers**: Controllers MUST act as thin orchestrators. They should only extract validated request data (from `req.body`, `req.params`, `req.query`), call the appropriate service method, and send the final response. They must NOT contain business logic.
- **Middleware**: ALWAYS use a centralized error handling middleware to catch `AppError` instances and return standardized JSON responses.
- **Express Types**: ALWAYS extend the Express `Request` type to include `user` or other custom properties attached by authentication middleware.
- **Validation**: ALWAYS verify code with `npm run lint && npm run check && npm test` immediately following any modification.

## Implementation Guidelines

- **Database Access**: Controllers call Services; Services interface with Prisma.
- **API Contract**: Strictly follow `API-Schema.md` definitions.
- **Testing**: `npm run check` (type check) must pass before any test execution.
