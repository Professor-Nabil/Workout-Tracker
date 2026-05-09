# Middleware & Error Handling Documentation

This document provides an overview of the middleware layer architecture and implementation, designed to ensure request security, data integrity, and centralized error management in the Workout Tracker application.

## Architectural Principles

1. **Thin Controllers**: Controllers focus solely on HTTP request/response orchestration, delegating all validation and business logic to middleware and services.
2. **Standardized Error Handling**: A centralized `errorHandler` captures all `AppError` instances, returning uniform JSON responses and logging technical details.
3. **Request Integrity**: All incoming request bodies, query parameters, and route parameters are validated using Zod schemas via a reusable `validate` middleware.
4. **Security**: JWT-based authentication is enforced via a standard `auth` middleware that decorates the Express `Request` object with user identity.
5. **Traceability**: All incoming HTTP requests are logged using `morgan` and `winston` for production-grade observability.

## Implemented Middlewares

### 1. Global Error Handling (`src/middlewares/error.ts`)

- **Objective**: Centralized catch-all for operational and unexpected errors.
- **Key Logic**: Identifies `AppError` subclasses to return appropriate status codes (400, 401, 404). Logs raw errors for debugging while keeping response bodies clean.

### 2. Validation Middleware (`src/middlewares/validate.ts`)

- **Objective**: Enforce API contract schemas.
- **Key Logic**: Uses Zod to parse `req.body`, `req.query`, and `req.params`. Automatically transforms invalid requests into `ValidationError` responses.

### 3. Authentication Middleware (`src/middlewares/auth.ts`)

- **Objective**: Secure private routes.
- **Key Logic**: Validates `Authorization: Bearer <token>` headers, verifies JWT authenticity, and injects `user.userId` into the `Request` object.
- **Type Augmentation**: Extends `Express.Request` globally via `declare module "express-serve-static-core"`.

### 4. Logging Middleware (`src/middlewares/logger.ts`)

- **Objective**: Request tracing.
- **Key Logic**: Integrates `morgan` with `winston` to log method, path, response status, and duration in a structured format.

## Testing & Quality Control

- **Middleware Testing**: All critical middlewares have unit tests in `tests/unit/middlewares/` using `vitest` mocks for `Request`, `Response`, and `NextFunction`.
- **Validation**: Every change must pass `npm run lint` and `npm run check`.
- **Imports**: All relative imports in middleware files must include the `.js` extension.
