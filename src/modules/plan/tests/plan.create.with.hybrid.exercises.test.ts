/*
 * ### API ### POST '/plan/create
 * *** Create Plan *** with Hybrid Exercises (Cardio + Strength)
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

describe("### API ### POST '/plan/create", () => {
  let realUser: User;
  let dbRefreshToken: RefreshToken;
  let incommingRefreshToken: string;
  let incommingAccessToken: string;
  let realExercise: Exercise[];

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
    realExercise = await db.exercise.findMany({
      take: 2,
    });
    if (realExercise.length < 2) {
      throw new Error(
        "Database health check failed: Seed data must contain at least 2 distinct exercises (e.g., Bench Press and Running).",
      );
    }
  });
  it("*** Create Plan *** with one nested Exercise", async () => {
    // -------------------------------------------------------------
    // Simiolate real requset body
    const reqBody = {
      title: "Hybrid Strength & Cardio Routine",
      userId: realUser.id,
      planExercises: [
        {
          exerciseId: realExercise[0]!.id,
          weight: 100, // 100 kg
          sets: 4,
          reps: 5,
          // period: undefined, // Explicitly omitted for heavy compound lifting
        },
        {
          exerciseId: realExercise[1]!.id,
          // weight: undefined, // Explicitly omitted for endurance tracking
          // sets: undefined,
          // reps: undefined,
          period: 20, // 20 minutes running
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
