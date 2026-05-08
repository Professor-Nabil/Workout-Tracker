# Testing Strategy

This document outlines the testing approach for the Workout Tracker application to ensure code quality, reliability, and security.

## Core Framework

- **Framework**: `vitest`
- **Runner**: `vitest`
- **Assertions**: Built-in `vitest` expectations (e.g., `expect(x).toBe(y)`)

## Testing Levels

### 1. Unit Testing

- **Focus**: Testing individual functions, utilities, and isolated business logic (services).
- **Tooling**: Mocks for database calls (Prisma) and external services.
- **Criteria**: Fast execution, zero side effects.
- **Location**: `src/**/*.spec.ts`

### 2. Integration Testing

- **Focus**: Testing API routes and database interactions.
- **Tooling**: Supertest for API requests; a dedicated test database (MariaDB).
- **Criteria**: Ensure that controllers, services, and the database schema work together correctly.
- **Location**: `tests/integration/**/*.test.ts`

### 3. End-to-End (E2E) Testing

- **Focus**: Testing complete workflows (e.g., Sign-Up -> Create Workout -> Report Generation).
- **Criteria**: Verification of the full stack (API, DB, Auth).
- **Location**: `tests/e2e/**/*.test.ts`

## Execution & Workflow

1. **Prerequisite**: Run `npm run check` (type check) before running any tests.
2. **Setup**: Use `vitest` environment configurations to set up isolated test databases.
3. **CI/CD Integration**: All tests must pass before merging to main.
4. **Coverage Enforcement**: Use `vitest --coverage` to generate and monitor code coverage reports.
5. **Watch Mode**: Use `vitest --watch` in a separate `tmux` pane for instant feedback during the TDD loop.

## Environment Setup

- **Test Env**: Use a separate `.env.test` for integration/E2E tests to ensure tests connect to a dedicated testing database (never the local development or production DB).

## Utilities & Factories

- **Data Factories**: Use a dedicated factory directory (`tests/factories/`) to generate consistent, valid test data for `User`, `Workout`, etc.
- **Coverage**: Aim for minimum 80% code coverage. Enforced via `vitest --coverage`.

## TDD Protocol

1. **Define Test**: Write a failing test for a new requirement.
2. **Implement Code**: Write the minimum code necessary to pass the test.
3. **Refactor**: Clean up the implementation while maintaining passing tests.
4. **Repeat**: Follow this cycle for all business-critical logic.
