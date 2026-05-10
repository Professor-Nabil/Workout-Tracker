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

  describe("GET /api/exercises", () => {
    it("should list all available exercises for the user", async () => {
      const category = await testPrisma.exerciseCategory.create({
        data: { name: "Strength" },
      });
      await testPrisma.exercise.create({
        data: {
          name: "Squat",
          categoryId: category.id,
          ownerId: userId,
          isSystem: false,
        },
      });

      const response = await request(app)
        .get("/api/exercises")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe("Squat");
    });
  });

  describe("POST /api/exercises", () => {
    it("should create a new exercise successfully", async () => {
      const category = await testPrisma.exerciseCategory.create({
        data: { name: "Strength" },
      });

      const response = await request(app)
        .post("/api/exercises")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Deadlift",
          categoryId: category.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("Deadlift");
    });
  });

  describe("PATCH /api/exercises/:id", () => {
    it("should update an exercise successfully", async () => {
      const category = await testPrisma.exerciseCategory.create({
        data: { name: "Strength" },
      });
      const exercise = await testPrisma.exercise.create({
        data: {
          name: "Squat",
          categoryId: category.id,
          ownerId: userId,
          isSystem: false,
        },
      });

      const response = await request(app)
        .patch(`/api/exercises/${exercise.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Squat V2" });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Squat V2");
    });
  });

  describe("DELETE /api/exercises/:id", () => {
    it("should delete an exercise successfully", async () => {
      const category = await testPrisma.exerciseCategory.create({
        data: { name: "Strength" },
      });
      const exercise = await testPrisma.exercise.create({
        data: {
          name: "Squat",
          categoryId: category.id,
          ownerId: userId,
          isSystem: false,
        },
      });

      const response = await request(app)
        .delete(`/api/exercises/${exercise.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Exercise deleted successfully");

      const deletedExercise = await testPrisma.exercise.findUnique({
        where: { id: exercise.id },
      });
      expect(deletedExercise).toBeNull();
    });
  });
});
