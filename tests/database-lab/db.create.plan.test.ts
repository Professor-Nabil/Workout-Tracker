/*
 * ### Database health ### Create Plan
 * *** Create Plan *** with one nested Exercise
 */
import { describe, it, expect, beforeAll } from "vitest"; // Ensure clean imports
import db from "../../src/lib/db.js";
import { faker } from "@faker-js/faker";
import type { User, Exercise } from "../../src/generated/prisma/client.js";

describe("### Database health ### Create Plan", () => {
  // -------------------------------------------------------------
  // Create user and find exercise
  let realUser: User;
  let realExercise: Exercise;

  beforeAll(async () => {
    // 1. Setup real user
    realUser = await db.user.create({
      data: {
        email: faker.internet.email(),
        hashPassword: faker.internet.password(),
      },
    });

    // 2. Fetch an exercise from your seeded database
    const exercise = await db.exercise.findFirst({});
    if (!exercise) {
      throw new Error(
        "Database health check failed: No exercises found in seed data.",
      );
    }
    realExercise = exercise;
  });

  // -------------------------------------------------------------
  it("*** Create plan with nested exercises ***", async () => {
    // -------------------------------------------------------------
    // Simiolate real requset body
    const reqBody = {
      // WARN: Every user should has one unique plan title
      title: "Hypertrophy Push Day", // Unique for each user
      userId: realUser.id,
      planExercises: [
        {
          exerciseId: realExercise.id,
          weight: 10,
          period: 20,
          sets: 4,
          reps: 8,
        },
      ],
    };

    // -------------------------------------------------------------
    // Execute Prisma transaction creation
    const result = await db.plan.create({
      data: {
        title: reqBody.title,
        userId: reqBody.userId,
        // Prisma uses nested writes here to create the plan and relation simultaneously
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
      // Include the relation in the result so we can assert on it!
      include: {
        planExercise: true,
      },
    });

    // --- Assertions (Checking the real outcome) ---
    expect(result.id).toBeDefined();
    expect(result.title).toBe(reqBody.title);
    expect(result.userId).toBe(realUser.id);

    // Ensure the nested table actually got populated
    expect(result.planExercise).toHaveLength(1);
    expect(result.planExercise[0]?.exerciseId).toBe(realExercise.id);
    expect(result.planExercise[0]?.sets).toBe(4);
  });
});
