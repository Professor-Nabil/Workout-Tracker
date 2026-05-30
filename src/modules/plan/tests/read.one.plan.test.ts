/*
 * ### API ### GET '/plan/readone
 * *** Read Plan *** Read one plan
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
import {
  apiPlanCreate,
  apiPlanReadOne,
} from "../../test.helpers/supertest.helper.js";
import z from "zod";
import { seedOnePlan } from "../../test.helpers/seed.plan.helper.js";

describe("### API ### GET '/plan/readone", () => {
  let realUser: User;
  let dbRefreshToken: RefreshToken;
  let incommingRefreshToken: string;
  let incommingAccessToken: string;
  let realExercise: Exercise;
  let realPalan: Plan;

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
    realPalan = await seedOnePlan(realUser.id);
  });
  it("*** Read Plan *** Read one plan", async () => {
    // -------------------------------------------------------------
    // console.log(realPalan);
    // -------------------------------------------------------------
    const res = await apiPlanReadOne(realPalan.id, 200, incommingAccessToken);
    // -------------------------------------------------------------
    expect(res.body.data.user.id).toBe(realUser.id);
    expect(res.body.data.plan.id).toBe(realPalan.id);
    expect(1).toBe(1);
  });
});
