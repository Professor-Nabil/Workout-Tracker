# Technical Stack & Architecture

This document outlines the core technology stack and architectural patterns for the Workout Tracker application.

## Core Stack

- **Language**: TypeScript
- **Runtime/Tools**: Node.js, `tsx` (for execution), `tsc` (for type checking)
- **Database**: Local MariaDB
- **ORM**: Prisma
- **Environment Management**: `dotenv`, `zod` (for runtime environment validation)

## Testing Strategy

- **Framework**: `vitest`
- **TDD Protocol**:
  1. Define unit/integration tests before implementing features.
  2. Ensure `npm run check` (type checking) passes before running any test.
  3. **Hierarchy**:
     - Utilities (Pure Functions)
     - Data Transformation
     - Business Logic
     - Integration/Contract Testing (API routes)

## Security

- **Authentication**: JWT (JSON Web Tokens) with Access/Refresh strategy.
- **Password**: Hashing via `bcrypt`.
- **Validation**: Strict schema validation using `zod` for all API request inputs.
- **Access Control**: Middleware to ensure authenticated routes only allow access to owned resources.

## Error Handling

- **Strategy**: Centralized error middleware.
- **Implementation**:
  - Use custom error classes (e.g., `AppError`, `ValidationError`).
  - Standardize error responses:

    ```json
    {
      "status": "error",
      "message": "Human readable message",
      "details": "Technical info (optional)"
    }
    ```

## Development Workflow

- **Git**: Always use descriptive, actionable commit messages.
- **Workflow**: Terminal-first approach using `tmux`, `Neovim`.
- **Validation**: `tsc --noEmit` check on every build; strictly typed API contracts.

## Logging Strategy

- **Library**: `winston`
- **Configuration**: JSON-structured logs for production, colorized console output for development.
- **Implementation**:
  - Log errors to `logs/error.log` and all logs to `logs/combined.log`.
  - Integrate `morgan` with `winston` for API request logging.

## Database Seeding

- **Strategy**: Automated seeding via Prisma.
- **Implementation**:
  - **ExerciseCategory**: Use `name` as the unique identifier for `upsert`.
  - **Exercise**: Use `name` as the unique identifier for `upsert`. Set `isSystem` to `true` for all seed data.
  - **Idempotency**: All seed operations must be idempotent (safe to run multiple times).
  - **Tooling**: A custom seeding script executed via `tsx prisma/seed.ts` integrated into the project's setup workflow.
