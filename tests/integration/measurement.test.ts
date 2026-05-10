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

describe("Measurement Routes Integration Tests", () => {
  let token: string;
  let userId: string;
  let dbName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let testPrisma: any;

  beforeAll(async () => {
    dbName = "measurement_test_" + Math.random().toString(36).substring(7);
    testPrisma = await createTestDatabase(dbName);
    vi.spyOn(db, "prisma", "get").mockReturnValue(testPrisma);
  });

  afterAll(async () => {
    await dropTestDatabase(dbName);
  });

  beforeEach(async () => {
    userId = "test-user-id-" + Math.random().toString(36).substring(7);
    await testPrisma.bodyMeasurement.deleteMany({});
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

  describe("POST /api/measurements", () => {
    it("should create a measurement successfully", async () => {
      const response = await request(app)
        .post("/api/measurements")
        .set("Authorization", `Bearer ${token}`)
        .send({ weight: 75.5 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.weight).toBe(75.5);
    });
  });

  describe("GET /api/measurements", () => {
    it("should list all measurements", async () => {
      await testPrisma.bodyMeasurement.create({
        data: { weight: 70, userId },
      });

      const response = await request(app)
        .get("/api/measurements")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].weight).toBe(70);
    });
  });

  describe("PATCH /api/measurements/:id", () => {
    it("should update a measurement successfully", async () => {
      const m = await testPrisma.bodyMeasurement.create({
        data: { weight: 70, userId },
      });

      const response = await request(app)
        .patch(`/api/measurements/${m.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ weight: 72 });

      expect(response.status).toBe(200);
      expect(response.body.weight).toBe(72);
    });
  });

  describe("DELETE /api/measurements/:id", () => {
    it("should delete a measurement successfully", async () => {
      const m = await testPrisma.bodyMeasurement.create({
        data: { weight: 70, userId },
      });

      const response = await request(app)
        .delete(`/api/measurements/${m.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Measurement deleted successfully");
    });
  });
});
