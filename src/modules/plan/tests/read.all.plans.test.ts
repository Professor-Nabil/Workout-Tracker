/*
 * ### API ### GET '/plan/readmany
 * *** Read Plan *** Read all user plans
 */
import { faker } from "@faker-js/faker";
import type {
  User,
  RefreshToken,
  Exercise,
  Plan,
} from "../../../generated/prisma/client.js";
import db from "../../../lib/db.js";
import { seedRefreshToken } from "../../test.helpers/seed.fake.users.js";
import { apiPlanReadmany } from "../../test.helpers/supertest.helper.js";
import { seedManyPlan } from "../../test.helpers/seed.plan.helper.js";

describe("### API ### GET '/plan/readmany", () => {
  let realUser: User;
  let dbRefreshToken: RefreshToken;
  let incommingRefreshToken: string;
  let incommingAccessToken: string;
  let realExercise: Exercise;
  let realUserPlanList: Plan[] = [];

  beforeAll(async () => {
    // -------------------------------------------------------------
    realUser = await db.user.create({
      data: {
        email: faker.internet.email(),
        hashPassword: faker.internet.password(),
      },
    });

    // -------------------------------------------------------------
    const { databaseToken, originalRefreshToken, accessToken } =
      await seedRefreshToken(realUser.id);
    dbRefreshToken = databaseToken;
    incommingRefreshToken = originalRefreshToken;
    incommingAccessToken = accessToken;
    // -------------------------------------------------------------
    const ex = await db.exercise.findFirst();
    if (ex) realExercise = ex;
    // -------------------------------------------------------------
    // realUserPlanList = await seedManyPlan(realUser.id);
    for (let i = 0; i < 2; i++) {
      const result = await seedManyPlan(realUser.id);
      realUserPlanList.push(result);
    }
  });

  it("*** Read Plan *** Read all user plans", async () => {
    // -------------------------------------------------------------
    // console.log(JSON.stringify(realUserPlanList, null, 2));
    // -------------------------------------------------------------
    const res = await apiPlanReadmany(incommingAccessToken);
    // -------------------------------------------------------------
    expect(res.status).toBe(200);
    // -------------------------------------------------------------
    expect(res.body.data.user.id).toBe(realUser.id);
    // -------------------------------------------------------------
    expect(res.body.data.plans.length).toBe(realUserPlanList.length);
    // -------------------------------------------------------------
    // console.log(JSON.stringify(res.body, null, 2));
  });
});
