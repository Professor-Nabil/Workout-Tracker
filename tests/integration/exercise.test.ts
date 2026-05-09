import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/lib/db.js";
import jwt from "jsonwebtoken";
import { env } from "../../src/lib/env.js";

describe("Exercise Routes Integration Tests", () => {
  let token: string;
  const userId = "test-user-id-" + Math.random().toString(36).substring(7);

  beforeEach(async () => {
    await prisma.workoutExercise.deleteMany({});
    await prisma.workout.deleteMany({});
    await prisma.exercise.deleteMany({});
    await prisma.exerciseCategory.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.user.create({
      data: {
        id: userId,
        email: "test@example.com",
        password: "password",
      },
    });
    token = jwt.sign({ userId }, env.JWT_ACCESS_SECRET);
  });

  describe("GET /api/exercises/categories", () => {
    it("should list all exercise categories", async () => {
      await prisma.exerciseCategory.create({
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
