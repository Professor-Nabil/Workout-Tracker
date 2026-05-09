# Middleware & Global Error Handling Plan

This plan outlines the implementation of the middleware layer, focusing on request validation, authentication, and centralized error management to maintain "thin" controllers.

## 1. Global Error Handling

- **Objective**: Ensure all errors are caught and converted to a standardized JSON response.
- **Implementation**: Create `src/middlewares/error.ts`.
- **Requirements**:
  - Catch `AppError` instances (return specified status code and message).
  - Catch unexpected errors (return 500 status).
  - Redact stack traces in non-development environments.
  - Log errors via `winston` (as defined in `Logging-Strategy.md`).

## 2. Validation Middleware

- **Objective**: Intercept and validate incoming API requests against `API-Schema.md` definitions.
- **Implementation**: Create `src/middlewares/validate.ts`.
- **Requirements**:
  - Accept a `zod` schema as a parameter.
  - Validate `req.body`, `req.query`, and `req.params`.
  - Throw `ValidationError` (from `src/lib/errors.ts`) if validation fails.

## 3. Authentication Middleware

- **Objective**: Secure routes requiring identity verification.
- **Implementation**: Create `src/middlewares/auth.ts`.
- **Requirements**:
  - Extract JWT from `Authorization: Bearer <token>` header.
  - Verify token using `AuthService` and JWT secrets.
  - Attach `userId` to `req.user` (extend Express Request type).
  - Throw `AuthenticationError` if token is missing or invalid.

## 4. Logging Middleware

- **Objective**: Trace all incoming API requests.
- **Implementation**: Create `src/middlewares/logger.ts`.
- **Requirements**:
  - Integrate `morgan` with `winston` for consistent HTTP request logging.
  - Log method, path, status, and duration.
