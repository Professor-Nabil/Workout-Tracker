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

## Implementation Guidelines

- **Database Access**: Controllers call Services; Services interface with Prisma.
- **API Contract**: Strictly follow `API-Schema.md` definitions.
- **Testing**: `npm run check` (type check) must pass before any test execution.
