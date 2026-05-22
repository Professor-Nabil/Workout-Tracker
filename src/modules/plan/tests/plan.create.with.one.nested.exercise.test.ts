/*
 * *** Create Plan *** with one nested Exercise
 */
import { faker } from "@faker-js/faker";
import type {
  User,
  RefreshToken,
  Exercise,
} from "../../../generated/prisma/client.js";
import db from "../../../lib/db.js";
import { seedRefreshToken } from "../../test.helpers/seed.fake.users.js";
import { apiPlanCreate } from "../../test.helpers/supertest.helper.js";
import z from "zod";

describe("API POST '/plan/create", () => {
  let realUser: User;
  let dbRefreshToken: RefreshToken;
  let incommingRefreshToken: string;
  let incommingAccessToken: string;
  let realExercise: Exercise;

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
  });
  it("*** Create Plan *** with one nested Exercise", async () => {
    // -------------------------------------------------------------
    // Simiolate real requset body
    const reqBody = {
      title: "Hypertrophy Push Day",
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
    // Test Endpoint
    const res = await apiPlanCreate(reqBody, 201, incommingAccessToken);
    // -------------------------------------------------------------
    expect(res).toHaveProperty("body");
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("userId");
    expect(res.body.data.userId).toBe(realUser.id);
    expect(res.body.data).toHaveProperty("planId");
    expect(z.uuid().safeParse(res.body.data.planId).success).toBe(true);
  });
});
