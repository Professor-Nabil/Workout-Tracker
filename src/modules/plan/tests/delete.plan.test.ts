/*
 * ### API ### DELETE '/plan/delete/:planId
 * *** Delete Plan *** Delete one plan for one user
 */
import db from "../../../lib/db.js";
import { faker } from "@faker-js/faker";
import type { User, Exercise, Plan } from "../../../generated/prisma/client.js";
import type { PlanUpdateSchema } from "../plan.schema.js";
import { seedRefreshToken } from "../../test.helpers/seed.fake.users.js";
import {
  apiPlanDelete,
  apiPlanUpdate,
} from "../../test.helpers/supertest.helper.js";

describe("### API ### DELETE '/plan/delete/:planId", () => {
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

  it("*** Delete Plan *** Delete one plan for one user", async () => {
    // -------------------------------------------------------------
    await apiPlanDelete(initialPlan.id, 204, incommingAccessToken);
    // -------------------------------------------------------------
    const findPlan = await db.plan.findMany({ where: { id: initialPlan.id } });
    expect(findPlan).toStrictEqual([]);
    // -------------------------------------------------------------
  });
});
