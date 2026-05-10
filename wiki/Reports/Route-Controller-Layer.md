# Route and Controller Layer Documentation

This document describes the architectural patterns and implementation principles for the Route and Controller layers in the Workout Tracker API.

## 1. Architectural Philosophy

The API follows a strict **"Thin Controller"** architecture to maintain separation of concerns, improve testability, and simplify maintenance.

- **Routes**: Define the API contract. They are responsible for:
  - Defining paths and HTTP methods.
  - Applying route-level middleware (Auth, Validation).
  - Mapping requests to controller functions.
- **Controllers**: Act as thin orchestrators. They are responsible for:
  - Extracting validated input from `req.body`, `req.params`, or `req.query`.
  - Calling the corresponding Service method.
  - Sending the standardized JSON response.
  - **No Business Logic**: Controllers contain NO logic other than request handling and response delegation.
  - **No Error Handling**: Controllers do NOT use `try-catch` blocks. All exceptions are propagated to the centralized Error Handler middleware.

## 2. Key Implementation Standards

### Request Validation

We utilize `zod` for request validation. Every route that accepts user input MUST use the `validate` middleware:

```typescript
router.post("/", validate({ body: createSchema }), controller.create);
```

### Security & Authentication

All protected routes are guarded by the `auth` middleware. It populates `req.user` with the authenticated user's data (e.g., `userId`).

### Error Handling

A centralized error-handling middleware is registered in `src/app.ts`. It catches `AppError` instances (or generic errors) and returns a standardized JSON response:

```json
{
  "status": "error",
  "message": "Error description"
}
```

### Routing Best Practices

- **Specificity**: More specific sub-routes (e.g., `/:workoutId/exercises/reorder`) must be defined before generic parameterized routes (e.g., `/:workoutId/exercises/:workoutExerciseId`) to ensure correct matching.
- **Modularity**: Every entity has its own route file in `src/routes/` and corresponding controller in `src/controllers/`.

## 3. Communication Flow

1. **Client** → **Route** (Validation/Auth Middleware)
2. **Route** → **Controller** (Input extraction)
3. **Controller** → **Service** (Business logic/Database interaction)
4. **Service** → **Database** (Prisma)
5. **Service** → **Controller** (Data/Error)
6. **Controller** → **Client** (JSON Response)
