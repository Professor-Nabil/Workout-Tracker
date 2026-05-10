import { vi, describe, it, expect, beforeEach, afterAll, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import * as db from "../../src/lib/db.js";
import { createTestDatabase, dropTestDatabase } from "../lib/test-db.js";
import jwt from "jsonwebtoken";
import { env } from "../../src/lib/env.js";

vi.mock("../../src/lib/db.js", () => ({
  prisma: {}
}));

describe("Report Routes Integration Tests", () => {
  let token: string;
  let userId: string;
  let dbName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let testPrisma: any;

  beforeAll(async () => {
    dbName = "report_test_" + Math.random().toString(36).substring(7);
    testPrisma = await createTestDatabase(dbName);
    vi.spyOn(db, "prisma", "get").mockReturnValue(testPrisma);
  });

  afterAll(async () => {
    await dropTestDatabase(dbName);
  });

  beforeEach(async () => {
    userId = "test-user-id-" + Math.random().toString(36).substring(7);
    await testPrisma.bodyMeasurement.deleteMany({});
    await testPrisma.workout.deleteMany({});
    await testPrisma.user.deleteMany({});
    await testPrisma.user.create({
      data: {
        id: userId,
        email: `test-${userId}@example.com`,
        password: "password",
      },
    });
    token = jwt.sign({ userId }, env.JWT_ACCESS_SECRET);
  });

  describe("GET /api/reports/progress", () => {
    it("should return workout summary and weight progress", async () => {
      await testPrisma.workout.create({
        data: {
          title: "Leg Day",
          scheduledAt: new Date(),
          userId,
          status: "COMPLETED",
        },
      });
      await testPrisma.bodyMeasurement.create({
        data: { weight: 70, userId, date: new Date() },
      });

      const response = await request(app)
        .get("/api/reports/progress")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("workoutSummary");
      expect(response.body).toHaveProperty("weightProgress");
    });
  });
});
