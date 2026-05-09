# Controller & Route Implementation Plan

This plan outlines the implementation of the controller and route layers, ensuring a "thin" controller architecture that delegates business logic to services.

## 1. Core Principles

- **Separation of Concerns**: Routes define the API contract (path, method, middleware); Controllers handle input extraction and response formatting.
- **Request Validation**: Apply validation middleware (from `src/middlewares/validate.ts`) to all routes based on schemas defined in `API-Schema.md`.
- **Security**: Apply `auth` middleware to all protected routes.
- **Error Handling**: Controllers rely on the `errorHandler` middleware; no `try-catch` boilerplate is needed within the controller logic if errors are properly propagated.

## 2. Implementation Steps

### Step 1: Authentication Routes (`src/routes/auth.route.ts`)

- **Controllers**: `src/controllers/auth.controller.ts`
- **Endpoints**:
  - `POST /api/auth/signup`: Validate input, call `AuthService.register`.
  - `POST /api/auth/login`: Validate input, call `AuthService.login` and `AuthService.generateTokens`.
  - `POST /api/auth/refresh`: Validate refresh token, call `AuthService.refreshAccessToken`.
  - `POST /api/auth/logout`: Validate refresh token, call `AuthService.revokeRefreshToken`.

### Step 2: Workout Routes (`src/routes/workout.route.ts`)

- **Controllers**: `src/controllers/workout.controller.ts`
- **Endpoints**:
  - `POST /api/workouts`: Auth protected, validate input, call `WorkoutService.create`.
  - `GET /api/workouts`: Auth protected, call `WorkoutService.list`.
  - `GET /api/workouts/:id`: Auth protected, call `WorkoutService.getById`.
  - `PATCH /api/workouts/:id`: Auth protected, validate input, call `WorkoutService.update`.
  - `DELETE /api/workouts/:id`: Auth protected, call `WorkoutService.softDelete`.
  - `POST /api/workouts/:workoutId/exercises`: Auth protected, validate input, call `WorkoutService.addExercise`.
  - `DELETE /api/workouts/:workoutId/exercises/:workoutExerciseId`: Auth protected, call `WorkoutService.removeExercise`.
  - `PATCH /api/workouts/:workoutId/exercises/:workoutExerciseId`: Auth protected, call `WorkoutService.updateExerciseStatus`.

### Step 3: Exercise & Progress Routes (`src/routes/exercise.route.ts`, `src/routes/measurement.route.ts`)

- **Controllers**: `src/controllers/exercise.controller.ts`, `src/controllers/measurement.controller.ts`
- **Endpoints**:
  - `GET /api/exercises/categories`: Auth protected, call `CategoryService.list`.
  - `GET /api/exercises`: Auth protected, call `ExerciseService.list`.
  - `POST /api/exercises`: Auth protected, call `ExerciseService.create`.
  - `PATCH /api/exercises/:id`: Auth protected, validate input, call `ExerciseService.update`.
  - `DELETE /api/exercises/:id`: Auth protected, call `ExerciseService.delete`.
  - `POST /api/measurements`: Auth protected, call `MeasurementService.create`.
  - `GET /api/measurements`: Auth protected, call `MeasurementService.list`.
  - `PATCH /api/measurements/:id`: Auth protected, validate input, call `MeasurementService.update`.
  - `DELETE /api/measurements/:id`: Auth protected, call `MeasurementService.delete`.

### Step 4: Reports (`src/routes/report.route.ts`)

- **Controllers**: `src/controllers/report.controller.ts`
- **Endpoints**:
  - `GET /api/reports/progress`: Auth protected, call `ReportService.getWorkoutSummary` & `ReportService.getWeightProgress`.

## 3. Documentation & Testing

- **OpenAPI/Swagger**: Generate API specs based on Zod schemas.
- **Integration Testing**: Use `supertest` to verify that routes -> controllers -> services -> database flow correctly.
