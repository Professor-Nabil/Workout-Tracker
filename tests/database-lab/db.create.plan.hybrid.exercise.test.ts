/*
 * ### Database health ### Create Hybrid Plan Routine
 * *** Create Plan *** with Hybrid Exercises (Cardio + Strength)
 */
import db from "../../src/lib/db.js";
import { faker } from "@faker-js/faker";
import type { User, Exercise } from "../../src/generated/prisma/client.js";

describe("### Database health ### Create Hybrid Plan Routine", () => {
  let realUser: User;
  let realExercises: Exercise[];

  beforeAll(async () => {
    // 1. Setup a clean environment user
    realUser = await db.user.create({
      data: {
        email: faker.internet.email(),
        hashPassword: faker.internet.password(),
      },
    });

    // 2. Pull exactly 2 separate exercises from the seeded database
    realExercises = await db.exercise.findMany({
      take: 2,
    });

    if (realExercises.length < 2) {
      throw new Error(
        "Database health check failed: Seed data must contain at least 2 distinct exercises (e.g., Bench Press and Running).",
      );
    }
  });

  it("*** Create Plan *** with Hybrid Exercises (Cardio + Strength)", async () => {
    // -------------------------------------------------------------
    // Simiolate real requset body
    // Check elements: index 0 is used for lifting, index 1 is used for time duration tracking
    const reqBody = {
      // WARN: Every user should has one unique plan title
      title: "Hybrid Strength & Cardio Routine",
      userId: realUser.id,
      planExercises: [
        {
          exerciseId: realExercises[0]!.id,
          weight: 100, // 100 kg
          sets: 4,
          reps: 5,
          // period: undefined, // Explicitly omitted for heavy compound lifting
        },
        {
          exerciseId: realExercises[1]!.id,
          // weight: undefined, // Explicitly omitted for endurance tracking
          // sets: undefined,
          // reps: undefined,
          period: 20, // 20 minutes running
        },
      ],
    };

    // Execute nested database records injection
    const result = await db.plan.create({
      data: {
        title: reqBody.title,
        userId: reqBody.userId,
        planExercise: {
          createMany: {
            data: reqBody.planExercises.map((ex) => ({
              exerciseId: ex.exerciseId,
              period: ex.period ?? null, // Cast JavaScript 'undefined' properties cleanly to database NULL states
              weight: ex.weight ?? null,
              sets: ex.sets ?? null,
              reps: ex.reps ?? null,
            })),
          },
        },
      },
      include: {
        planExercise: true,
      },
    });

    // --- Assertions (Verifying Database State Integrity) ---
    expect(result.id).toBeDefined();
    expect(result.title).toBe(reqBody.title);
    expect(result.userId).toBe(realUser.id);
    expect(result.planExercise).toHaveLength(2);

    // 1. Inspect and Validate Strength Target Metrics
    const strengthItem = result.planExercise.find(
      (item) => item.exerciseId === realExercises[0]!.id,
    );
    expect(strengthItem).toBeDefined();
    expect(strengthItem?.weight).toBe(100);
    expect(strengthItem?.sets).toBe(4);
    expect(strengthItem?.reps).toBe(5);
    expect(strengthItem?.period).toBe(null); // Database verified keeping this column empty safely

    // 2. Inspect and Validate Cardio/Time Duration Metrics
    const cardioItem = result.planExercise.find(
      (item) => item.exerciseId === realExercises[1]!.id,
    );
    expect(cardioItem).toBeDefined();
    expect(cardioItem?.period).toBe(20);
    expect(cardioItem?.weight).toBe(null); // Database verified keeping these tracking columns empty safely
    expect(cardioItem?.sets).toBe(null);
    expect(cardioItem?.reps).toBe(null);
  });
});
