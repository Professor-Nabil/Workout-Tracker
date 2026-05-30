/*
 * ### API ### PUT '/plan/update
 * *** Update Plan *** Update one plan for one user
 */
import db from "../../../lib/db.js";
import { faker } from "@faker-js/faker";
import type { User, Exercise, Plan } from "../../../generated/prisma/client.js";
import type { PlanUpdateSchema } from "../plan.schema.js";
import { seedRefreshToken } from "../../test.helpers/seed.fake.users.js";
import { apiPlanUpdate } from "../../test.helpers/supertest.helper.js";

describe("### API ### PUT '/plan/update", () => {
  let realUser: User;
  let realExercises: Exercise[];
  let initialPlan: Plan;
  let incommingAccessToken: string;

  beforeAll(async () => {
    // -------------------------------------------------------------
    // 1. Setup a real test user
    realUser = await db.user.create({
      data: {
        email: faker.internet.email(),
        hashPassword: faker.internet.password(),
      },
    });
    // -------------------------------------------------------------
    const { accessToken } = await seedRefreshToken(realUser.id);
    incommingAccessToken = accessToken;

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

  it("*** Update Plan *** Update one plan for one user", async () => {
    // -------------------------------------------------------------
    // SIMULATE REAL PRODUCTION REQUEST BODY FROM FRONTEND
    // -------------------------------------------------------------
    const updateReqBody: PlanUpdateSchema = {
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

    const { body } = await apiPlanUpdate(
      initialPlan.id,
      updateReqBody,
      200,
      incommingAccessToken,
    );

    // --- Assertions & Verifications ---

    // 1. Validate Parent Table Updates
    expect(body.data.id).toBe(initialPlan.id);
    expect(body.data.title).toBe(updateReqBody.title);
    expect(body.data.title).not.toBe(initialPlan.title);

    // 2. Validate Array Synchronization length
    expect(body.data.planExercise).toHaveLength(2);

    // 3. Verify Exercise 1 was purged safely
    const hasDeletedExercise = body.data.planExercise.some(
      (e: any) => e.exerciseId === realExercises[1]!.id,
    );
    expect(hasDeletedExercise).toBe(false);

    // 4. Verify updated fields match specifications perfectly
    const firstSaved = body.data.planExercise[0];
    expect(firstSaved.exerciseId).toBe(
      updateReqBody.planExercises[0]!.exerciseId,
    );
    expect(firstSaved?.weight).toBe(25);
    expect(firstSaved?.sets).toBe(4);
    expect(firstSaved?.reps).toBe(12);

    const secondSaved = body.data.planExercise[1];
    expect(secondSaved?.exerciseId).toBe(
      updateReqBody.planExercises[1]!.exerciseId,
    );
    expect(secondSaved?.weight).toBe(45);
  });
});

// console.log(JSON.stringify(body, null, 2));
// Outputs:
// {
//   "message": "Success read many plans for one usre",
//   "data": {
//     "id": "f1238725-f351-46fb-b09f-f52bd37f3be2",
//     "title": "Optimized Hypertrophy Push Day v2",
//     "userId": "dc37e8a6-bb8d-44a9-8b3a-04aa7210ac8d",
//     "planExercise": [
//       {
//         "id": "06d71c49-f5e7-424a-9d62-76c6347f6322",
//         "weight": 25,
//         "period": 60,
//         "sets": 4,
//         "reps": 12,
//         "planId": "f1238725-f351-46fb-b09f-f52bd37f3be2",
//         "exerciseId": "2c652032-1d02-49cd-95e8-222302771d93"
//       },
//       {
//         "id": "e87f0698-95f8-4f32-aafc-b0c7c7bb4137",
//         "weight": 45,
//         "period": 45,
//         "sets": 3,
//         "reps": 8,
//         "planId": "f1238725-f351-46fb-b09f-f52bd37f3be2",
//         "exerciseId": "75aec4d6-f655-4d65-8354-4f9c3c15120e"
//       }
//     ]
//   }
// }
