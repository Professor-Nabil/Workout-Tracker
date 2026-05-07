# Database Seeding Strategy

This document outlines the data that should be seeded into the database to ensure the application is functional from the first run.

---

## Categories to Seed (`ExerciseCategory`)

These categories are foundational for organizing exercises.

- Strength
- Cardio
- Flexibility
- Mobility

---

## Exercises to Seed (`Exercise`)

These are system-level exercises (`isSystem: true`) that are available to all users.

| Name           | Category    | Muscle Group |
| :------------- | :---------- | :----------- |
| Bench Press    | Strength    | Chest        |
| Squat          | Strength    | Legs         |
| Deadlift       | Strength    | Back         |
| Overhead Press | Strength    | Shoulders    |
| Pull-Ups       | Strength    | Back         |
| Push-Ups       | Strength    | Chest        |
| Running        | Cardio      | N/A          |
| Cycling        | Cardio      | N/A          |
| Yoga           | Flexibility | N/A          |

---

## Seeding Implementation Plan

1. **Clear Database (Optional):** Define a utility to clear non-system data if needed for development.
2. **Upsert Categories:** Iterate through the categories list and perform a `prisma.exerciseCategory.upsert` based on the `name`.
3. **Upsert Exercises:** Iterate through the exercises list, link them to the appropriate `ExerciseCategory` ID, and perform `prisma.exercise.upsert` based on the `name`. Ensure `isSystem: true` is set.
4. **Verification:** Run a script or check the database to ensure all categories and system exercises are present.

---

## Seeding Logic

- **ExerciseCategory**: Use `name` as the unique identifier for `upsert`.
- **Exercise**: Use `name` as the unique identifier for `upsert`. Set `isSystem` to `true` for all seed data.
- **Idempotency**: All seed operations must be idempotent (safe to run multiple times).
