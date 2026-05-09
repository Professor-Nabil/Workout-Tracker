# Service Layer Documentation

This document provides a comprehensive overview of the service layer architecture, design patterns, and current implementations within the Workout Tracker application.

## Architectural Principles

1. **Thick Services**: All business logic (validation, authorization, orchestration) resides here. Controllers remain "thin," acting only as request/response adapters.
2. **Dependency Isolation**: Services interact with the database exclusively via the Prisma client. They have no knowledge of the HTTP/Express layer.
3. **Error Propagation**: Standardized errors (`AppError`, `ResourceNotFoundError`, `AuthenticationError`) are thrown by services and handled by centralized middleware.
4. **Transactional Integrity**: Multi-step operations (e.g., adding an exercise to a workout) utilize `prisma.$transaction` to ensure atomic consistency.
5. **Statelessness**: All services are stateless classes, preventing circular dependencies and side effects.
6. **Owner-based Access**: Services involving user-owned data include `userId` checks (or system/owner `OR` queries) to prevent unauthorized access.

## Service Registry

### 1. AuthService

- **Purpose**: User lifecycle and security.
- **Key Methods**: `register`, `login`, `generateTokens`, `refreshAccessToken`, `revokeRefreshToken`.

### 2. WorkoutService

- **Purpose**: Core workout management.
- **Key Methods**:
  - `create`, `list`, `getById`, `update`, `softDelete`: Standard CRUD operations.
  - `addExercise`, `removeExercise`, `reorderExercises`, `updateExerciseStatus`: Workout detail management.
  - `updateStatus`: Lifecycle transitions (`IN_PROGRESS`, `COMPLETED`, etc.).

### 3. ExerciseService

- **Purpose**: Management of system and custom user exercises.
- **Key Methods**: `list`, `getById`, `create`, `update`, `delete`.
- **Constraint**: Enforces ownership (`ownerId` check) and distinguishes between system exercises (`isSystem: true`) and custom ones.

### 4. CategoryService

- **Purpose**: Management of exercise categories.
- **Key Methods**: `list`, `getById`.

### 5. MeasurementService

- **Purpose**: Physical progress tracking.
- **Key Methods**: `create`, `list`, `getById`, `update`, `delete`.

### 6. ReportService

- **Purpose**: Data aggregation and analytics.
- **Key Methods**: `getWorkoutSummary`, `getWeightProgress`.

## Testing & Mocking Standards

- **Framework**: `vitest`.
- **Mocking**: Services are unit-tested by mocking the Prisma client.
- **Requirement**: ALL used methods in a mock factory must be explicitly defined to avoid `undefined` reference errors.
- **Safety**: NEVER use `as any` for type casting. Use explicit mock object definitions. If unavoidable, use `// eslint-disable-next-line @typescript-eslint/no-explicit-any`.

## Quality Control Checklist

- **Linting/Type-Checking**: `npm run lint && npm run check` must pass before every commit.
- **Imports**: All relative file imports MUST end with `.js`.
- **Type Imports**: All generated types must be imported using `import type { ... } from "../../src/generated/client/client.js";`.
- **Read Pattern**: Every CRUD entity service MUST implement `list` and `getById` as standard read operations.
