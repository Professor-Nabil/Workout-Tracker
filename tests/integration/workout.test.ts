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

describe("Workout Routes Integration Tests", () => {
  let token: string;
  let userId: string;
  let dbName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let testPrisma: any;

  beforeAll(async () => {
    dbName = "workout_test_" + Math.random().toString(36).substring(7);
    testPrisma = await createTestDatabase(dbName);
    vi.spyOn(db, "prisma", "get").mockReturnValue(testPrisma);
  });

  afterAll(async () => {
    await dropTestDatabase(dbName);
  });

  beforeEach(async () => {
    userId = "test-user-id-" + Math.random().toString(36).substring(7);
    await testPrisma.workoutExercise.deleteMany({});
    await testPrisma.workout.deleteMany({});
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

  describe("POST /api/workouts", () => {
    it("should create a workout successfully", async () => {
      const response = await request(app)
        .post("/api/workouts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Leg Day",
          scheduledAt: new Date().toISOString(),
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Leg Day");
    });
  });

  describe("GET /api/workouts", () => {
    it("should list all user workouts", async () => {
      await testPrisma.workout.create({
        data: {
          title: "Push Day",
          scheduledAt: new Date(),
          userId,
        },
      });

      const response = await request(app)
        .get("/api/workouts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe("Push Day");
    });
  });

  describe("GET /api/workouts/:id", () => {
    it("should return a workout by id", async () => {
      const workout = await testPrisma.workout.create({
        data: {
          title: "Leg Day",
          scheduledAt: new Date(),
          userId,
        },
      });

      const response = await request(app)
        .get(`/api/workouts/${workout.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(workout.id);
      expect(response.body.title).toBe("Leg Day");
    });
  });

  describe("PATCH /api/workouts/:id", () => {
    it("should update a workout successfully", async () => {
      const workout = await testPrisma.workout.create({
        data: {
          title: "Leg Day",
          scheduledAt: new Date(),
          userId,
        },
      });

      const response = await request(app)
        .patch(`/api/workouts/${workout.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated Leg Day" });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated Leg Day");
    });
  });

  describe("DELETE /api/workouts/:id", () => {
    it("should soft delete a workout successfully", async () => {
      const workout = await testPrisma.workout.create({
        data: {
          title: "Leg Day",
          scheduledAt: new Date(),
          userId,
        },
      });

      const response = await request(app)
        .delete(`/api/workouts/${workout.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Workout deleted successfully");

      const deletedWorkout = await testPrisma.workout.findUnique({
        where: { id: workout.id },
      });
      expect(deletedWorkout?.deletedAt).not.toBeNull();
    });
  });

  describe("POST /api/workouts/:workoutId/exercises", () => {
    it("should add an exercise to a workout successfully", async () => {
      const workout = await testPrisma.workout.create({
        data: {
          title: "Leg Day",
          scheduledAt: new Date(),
          userId,
        },
      });

      const category = await testPrisma.exerciseCategory.create({
        data: { name: "Strength" },
      });

      const exercise = await testPrisma.exercise.create({
        data: {
          name: "Squat",
          categoryId: category.id,
        },
      });

      const response = await request(app)
        .post(`/api/workouts/${workout.id}/exercises`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          exerciseId: exercise.id,
          sequence: 1,
          sets: 3,
          reps: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.exerciseId).toBe(exercise.id);
    });
  });

  describe("DELETE /api/workouts/:workoutId/exercises/:workoutExerciseId", () => {
    it("should remove an exercise from a workout successfully", async () => {
      const workout = await testPrisma.workout.create({
        data: {
          title: "Leg Day",
          scheduledAt: new Date(),
          userId,
        },
      });

      const category = await testPrisma.exerciseCategory.create({
        data: { name: "Strength" },
      });

      const exercise = await testPrisma.exercise.create({
        data: {
          name: "Squat",
          categoryId: category.id,
        },
      });

      const workoutExercise = await testPrisma.workoutExercise.create({
        data: {
          workoutId: workout.id,
          exerciseId: exercise.id,
          sequence: 1,
        },
      });

      const response = await request(app)
        .delete(`/api/workouts/${workout.id}/exercises/${workoutExercise.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Exercise removed successfully");

      const deletedWorkoutExercise = await testPrisma.workoutExercise.findUnique({
        where: { id: workoutExercise.id },
      });
      expect(deletedWorkoutExercise).toBeNull();
    });
  });

  describe("PATCH /api/workouts/:workoutId/exercises/:workoutExerciseId", () => {
    it("should update exercise completion status successfully", async () => {
      const workout = await testPrisma.workout.create({
        data: {
          title: "Leg Day",
          scheduledAt: new Date(),
          userId,
        },
      });

      const category = await testPrisma.exerciseCategory.create({
        data: { name: "Strength" },
      });

      const exercise = await testPrisma.exercise.create({
        data: {
          name: "Squat",
          categoryId: category.id,
        },
      });

      const workoutExercise = await testPrisma.workoutExercise.create({
        data: {
          workoutId: workout.id,
          exerciseId: exercise.id,
          sequence: 1,
        },
      });

      const response = await request(app)
        .patch(`/api/workouts/${workout.id}/exercises/${workoutExercise.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ isCompleted: true });

      expect(response.status).toBe(200);
      expect(response.body.isCompleted).toBe(true);
    });
  });

  describe("PATCH /api/workouts/:workoutId/exercises/reorder", () => {
    it("should reorder exercises successfully", async () => {
      const workout = await testPrisma.workout.create({
        data: {
          title: "Leg Day",
          scheduledAt: new Date(),
          userId,
        },
      });

      const category = await testPrisma.exerciseCategory.create({
        data: { name: "Strength" },
      });

      const e1 = await testPrisma.exercise.create({
        data: { name: "Squat", categoryId: category.id },
      });
      const e2 = await testPrisma.exercise.create({
        data: { name: "Bench", categoryId: category.id },
      });

      const we1 = await testPrisma.workoutExercise.create({
        data: { workoutId: workout.id, exerciseId: e1.id, sequence: 1 },
      });
      const we2 = await testPrisma.workoutExercise.create({
        data: { workoutId: workout.id, exerciseId: e2.id, sequence: 2 },
      });

      const response = await request(app)
        .patch(`/api/workouts/${workout.id}/exercises/reorder`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          exercises: [
            { workoutExerciseId: we1.id, newSequence: 2 },
            { workoutExerciseId: we2.id, newSequence: 1 },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Exercises reordered successfully");

      const updatedWe1 = await testPrisma.workoutExercise.findUnique({ where: { id: we1.id } });
      const updatedWe2 = await testPrisma.workoutExercise.findUnique({ where: { id: we2.id } });

      expect(updatedWe1?.sequence).toBe(2);
      expect(updatedWe2?.sequence).toBe(1);
    });
  });
});
