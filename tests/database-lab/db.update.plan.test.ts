/*
 * ### Database health ### Update Complex Plan
 * *** Update Plan *** with multiple nested Exercises (Clear & Recreate Pattern)
 */
import db from "../../src/lib/db.js";
import { faker } from "@faker-js/faker";
import type {
  User,
  Exercise,
  Plan,
} from "../../src/generated/prisma/client.js";

describe("### Database health ### Update Complex Plan", () => {
  let realUser: User;
  let realExercises: Exercise[];
  let initialPlan: Plan;

  beforeAll(async () => {
    // 1. Setup a real test user
    realUser = await db.user.create({
      data: {
        email: faker.internet.email(),
        hashPassword: faker.internet.password(),
      },
    });

    // 2. Grab 3 distinct system exercises from seed data
    realExercises = await db.exercise.findMany({ take: 3 });

    if (realExercises.length < 3) {
      throw new Error(
        "Database health check failed: Please ensure your seed file inserts at least 3 exercises.",
      );
    }

    // 3. Seed an INITIAL complex plan containing Exercise 0 and Exercise 1
    initialPlan = await db.plan.create({
      data: {
        title: "Old Phase 1 Push Routine",
        userId: realUser.id,
        planExercise: {
          createMany: {
            data: [
              {
                exerciseId: realExercises[0]!.id,
                weight: 20,
                sets: 3,
                reps: 10,
              },
              {
                exerciseId: realExercises[1]!.id,
                weight: 30,
                sets: 3,
                reps: 10,
              },
            ],
          },
        },
      },
    });
  });

  it("*** Update Plan *** should successfully synchronize mutations using a transaction split", async () => {
    // -------------------------------------------------------------
    // SIMULATE REAL PRODUCTION REQUEST BODY FROM FRONTEND
    // -------------------------------------------------------------
    const updateReqBody = {
      planId: initialPlan.id, // Fixed: Extracted from frontend contract target
      title: "Optimized Hypertrophy Push Day v2",
      planExercises: [
        {
          exerciseId: realExercises[0]!.id,
          weight: 25,
          period: 60,
          sets: 4,
          reps: 12,
        },
        {
          exerciseId: realExercises[2]!.id, // BRAND NEW Exercise added!
          weight: 45,
          period: 45,
          sets: 3,
          reps: 8,
        },
      ],
    };

    // -------------------------------------------------------------
    // THE ACID TRANSACTION ENGINE (The Service implementation)
    // -------------------------------------------------------------
    const result = await db.$transaction(async (tx) => {
      // Step A: Wipe out all existing child links using incoming request payload ID
      await tx.planExercise.deleteMany({
        where: { planId: updateReqBody.planId },
      });

      // Step B: Update parent fields and insert the clean child array
      const updatedPlan = await tx.plan.update({
        where: { id: updateReqBody.planId },
        data: {
          title: updateReqBody.title,
          planExercise: {
            createMany: {
              data: updateReqBody.planExercises.map((ex) => ({
                exerciseId: ex.exerciseId,
                // Fixed: Explicit type safety layer mappings to prevent Prisma compile conflicts
                weight: ex.weight ?? null,
                period: ex.period ?? null,
                sets: ex.sets ?? null,
                reps: ex.reps ?? null,
              })),
            },
          },
        },
        include: {
          planExercise: {
            orderBy: {
              weight: "asc",
            },
          },
        },
      });

      return updatedPlan;
    });

    // --- Assertions & Verifications ---

    // 1. Validate Parent Table Updates
    expect(result.id).toBe(updateReqBody.planId);
    expect(result.title).toBe(updateReqBody.title);
    expect(result.title).not.toBe(initialPlan.title);

    // 2. Validate Array Synchronization length
    expect(result.planExercise).toHaveLength(2);

    // 3. Verify Exercise 1 was purged safely
    const hasDeletedExercise = result.planExercise.some(
      (e) => e.exerciseId === realExercises[1]!.id,
    );
    expect(hasDeletedExercise).toBe(false);

    // 4. Verify updated fields match specifications perfectly
    const firstSaved = result.planExercise[0];
    expect(firstSaved?.exerciseId).toBe(
      updateReqBody.planExercises[0]!.exerciseId,
    );
    expect(firstSaved?.weight).toBe(25);
    expect(firstSaved?.sets).toBe(4);
    expect(firstSaved?.reps).toBe(12);

    const secondSaved = result.planExercise[1];
    expect(secondSaved?.exerciseId).toBe(
      updateReqBody.planExercises[1]!.exerciseId,
    );
    expect(secondSaved?.weight).toBe(45);
  });
});
