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

describe("Exercise Routes Integration Tests", () => {
  let token: string;
  let userId: string;
  let dbName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let testPrisma: any;

  beforeAll(async () => {
    dbName = "exercise_test_" + Math.random().toString(36).substring(7);
    testPrisma = await createTestDatabase(dbName);
    vi.spyOn(db, "prisma", "get").mockReturnValue(testPrisma);
  });

  afterAll(async () => {
    await dropTestDatabase(dbName);
  });

  beforeEach(async () => {
    userId = "test-user-id-" + Math.random().toString(36).substring(7);
    await testPrisma.workoutExercise.deleteMany({});
    await testPrisma.exercise.deleteMany({});
    await testPrisma.exerciseCategory.deleteMany({});
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

  describe("GET /api/exercises/categories", () => {
    it("should list all exercise categories", async () => {
      await testPrisma.exerciseCategory.create({
        data: { name: "Strength" },
      });

      const response = await request(app)
        .get("/api/exercises/categories")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe("Strength");
    });
  });
});
