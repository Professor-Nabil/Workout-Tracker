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
- **Thin Controllers**: Controllers MUST act as thin orchestrators. They should only extract validated request data (from `req.body`, `req.params`, `req.query`), call the appropriate service method, and send the final response. They must NOT contain business logic.
- **Service Patterns**: For any CRUD entity, ALWAYS implement `list` and `getById` methods as standard read operations.
- **Middleware**: ALWAYS use a centralized error handling middleware to catch `AppError` instances and return standardized JSON responses.
- **Express Types**: ALWAYS extend the Express `Request` type to include `user` or other custom properties attached by authentication middleware.
- **Validation**: ALWAYS verify code with `npm run lint && npm run check && npm test` immediately following any modification.

## Implementation Guidelines

- **Database Access**: Controllers call Services; Services interface with Prisma.
- **API Contract**: Strictly follow `API-Schema.md` definitions.
- **Testing**: `npm run check` (type check) must pass before any test execution.
- **Git Workflow**: Use descriptive, conventional commit messages (e.g., `feat: ...`, `fix: ...`, `test: ...`). ALWAYS verify project status (`git status`, `git diff`) before committing.
- **Linting Unused Variables**: When dealing with unused Express parameters (e.g., `next`), always use `// eslint-disable-next-line @typescript-eslint/no-unused-vars` immediately preceding the parameter block.
- **Test Isolation**: ALWAYS use a dynamic database-per-test-file approach for integration tests to prevent race conditions and ensure parallel execution stability.
- **Route Ordering**: ALWAYS register more specific paths before parameterized paths (e.g., `/:workoutId/exercises/reorder` before `/:workoutId/exercises/:workoutExerciseId`) to avoid route matching conflicts.
- **Library Compatibility**: BEFORE integrating external libraries (especially those modifying prototypes or runtime behavior), strictly verify their peer dependency requirements against project versions (e.g., Zod v4 vs v3) to avoid runtime failures.
- **Documentation**: Prioritize manual, stable documentation over auto-generation scripts that rely on experimental or version-mismatched libraries.
- **Frontend Modularity**: For simple SSR frontends, maintain a clean separation by keeping `frontend/` (views/public) isolated. Mount views as middleware in `app.ts` using Express static/view-engine configuration. This allows the frontend to be swapped out completely (e.g., for a React SPA) without affecting backend business logic.
- **UI/UX API Integration**: When building the frontend, use the existing backend API as the "Source of Truth." Always verify frontend logic by directly calling API endpoints (`curl` or fetch) during development.
- **Avoid Over-Engineering**: For small-to-medium projects, prioritize simple, maintainable server-side rendering (EJS) over complex build-time generation tools (like auto-generating OpenAPI specs from code) if those tools cause runtime conflicts or prototype patching issues.
- **Stability First**: If a library (like `zod-to-openapi`) causes runtime instability, immediately decouple or remove it. "Bulletproof" code must be testable and stable; do not sacrifice runtime integrity for tool-based documentation.
- **Thin Controllers**: Controllers must NOT contain try-catch blocks; business errors should be propagated to the centralized error middleware.
