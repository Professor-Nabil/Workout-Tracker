/*
 * ### Database health ### Create Complex Plan
 * *** Create Plan *** with multiple nested Exercises
 */
import { describe, it, expect, beforeAll } from "vitest";
import db from "../../src/lib/db.js";
import { faker } from "@faker-js/faker";
import type { User, Exercise } from "../../src/generated/prisma/client.js";

describe("### Database health ### Create Complex Plan", () => {
  let realUser: User;
  let realExercises: Exercise[];

  beforeAll(async () => {
    // 1. Setup a real user
    realUser = await db.user.create({
      data: {
        email: faker.internet.email(),
        hashPassword: faker.internet.password(),
      },
    });

    // 2. Fetch up to 3 distinct exercises from your seeded database
    realExercises = await db.exercise.findMany({
      take: 3,
    });

    if (realExercises.length < 2) {
      throw new Error(
        "Database health check failed: Please ensure your seed file inserts at least 2 or 3 exercises.",
      );
    }
  });

  it("*** Create Plan *** with multiple nested Exercises", async () => {
    // -------------------------------------------------------------
    // Simiolate real requset body
    const reqBody = {
      // WARN: Every user should has one unique plan title
      title: "Complete Hypertrophy Push Routine",
      userId: realUser.id,

      planExercises: realExercises.map((exercise, index) => ({
        exerciseId: exercise.id,
        weight: 20 + index * 10, // 20kg, 30kg, 40kg
        period: 90, // 90 Minutes
        sets: 4,
        reps: 10,
      })),
    };

    // Execute the nested batch writing transaction
    const result = await db.plan.create({
      data: {
        title: reqBody.title,
        userId: reqBody.userId,
        planExercise: {
          createMany: {
            data: reqBody.planExercises.map((ex) => ({
              exerciseId: ex.exerciseId,
              period: ex.period,
              sets: ex.sets,
              reps: ex.reps,
              weight: ex.weight,
            })),
          },
        },
      },
      include: {
        planExercise: {
          orderBy: {
            weight: "asc", // Keeps array order predictable for our assertions
          },
        },
      },
    });

    // --- Assertions ---
    expect(result.id).toBeDefined();
    expect(result.title).toBe(reqBody.title);
    expect(result.userId).toBe(realUser.id);

    // Validate that the total number of connected exercises matches what we sent
    expect(result.planExercise).toHaveLength(reqBody.planExercises.length);

    // Assert details across your exercises dynamically
    result.planExercise.forEach((savedExercise, index) => {
      const originalPayload = reqBody.planExercises[index];

      expect(savedExercise.exerciseId).toBe(originalPayload?.exerciseId);
      expect(savedExercise.sets).toBe(originalPayload?.sets);
      expect(savedExercise.reps).toBe(originalPayload?.reps);
      expect(savedExercise.weight).toBe(originalPayload?.weight);
    });
  });
});
