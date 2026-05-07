# Database Models Documentation

This document outlines the database schema for the Workout Tracker application,
designed to support user authentication, workout management, progress tracking, and reporting.

## Enumerations

### WorkoutStatus

- `PLANNED` (Default)
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

### WeightUnit

- `KG` (Default)
- `LBS`

## Core Models

### User

- `id`: Unique identifier (UUID).
- `email`: User email (unique).
- `password`: Hashed password.
- `workouts`: Relation to owned workouts.
- `measurements`: Relation to body measurements.
- `refreshTokens`: Relation to refresh tokens.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last update timestamp.

### RefreshToken

- `id`: Unique identifier (UUID).
- `token`: Refresh token string (unique).
- `userId`: Relation to `User`.
- `expiresAt`: Expiration timestamp.
- `isRevoked`: Boolean (Default: false).
- `createdAt`: Creation timestamp.

### BodyMeasurement

- `id`: Unique identifier (UUID).
- `userId`: Relation to `User`.
- `weight`: Weight value.
- `date`: Measurement timestamp (Default: now).
- `notes`: Optional context.

## Exercise Management

### ExerciseCategory

- `id`: Unique identifier (UUID).
- `name`: Category name (unique).

### Exercise

- `id`: Unique identifier (UUID).
- `name`: Exercise name.
- `description`: Optional description.
- `isSystem`: Boolean (Default: true).
- `ownerId`: Optional relation to `User` (for custom exercises).
- `categoryId`: Relation to `ExerciseCategory`.
- `muscleGroup`: Targeted muscle group.

## Workout Management

### Workout

- `id`: Unique identifier (UUID).
- `title`: Workout title.
- `status`: `WorkoutStatus` (Default: `PLANNED`).
- `scheduledAt`: Scheduled timestamp.
- `startedAt` / `endedAt`: Session timestamps (optional).
- `comments`: Optional notes.
- `deletedAt`: Soft-delete timestamp (optional).
- `userId`: Relation to `User`.
- `createdAt`: Creation timestamp.
- `updatedAt`: Update timestamp.
- `@@index`: Composite index on `[userId, scheduledAt]`.

### WorkoutExercise

- `id`: Unique identifier (UUID).
- `workoutId` / `exerciseId`: Foreign keys to `Workout` and `Exercise`.
- `sequence`: Ordering (Default: 1).
- `sets` / `reps` / `weight`: Performance metrics (all optional).
- `weightUnit`: `WeightUnit` (Default: `KG`).
- `duration`: Duration in minutes (optional).
- `isCompleted`: Boolean (Default: false).
