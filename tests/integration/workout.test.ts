import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/lib/db.js";
import jwt from "jsonwebtoken";
import { env } from "../../src/lib/env.js";

describe("Workout Routes Integration Tests", () => {
  let token: string;
  const userId = "test-user-id";

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
      await prisma.workout.create({
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
      const workout = await prisma.workout.create({
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
      const workout = await prisma.workout.create({
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
      const workout = await prisma.workout.create({
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

      const deletedWorkout = await prisma.workout.findUnique({
        where: { id: workout.id },
      });
      expect(deletedWorkout?.deletedAt).not.toBeNull();
    });
  });

  describe("POST /api/workouts/:workoutId/exercises", () => {
    it("should add an exercise to a workout successfully", async () => {
      const workout = await prisma.workout.create({
        data: {
          title: "Leg Day",
          scheduledAt: new Date(),
          userId,
        },
      });

      const category = await prisma.exerciseCategory.create({
        data: { name: "Strength" },
      });

      const exercise = await prisma.exercise.create({
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
      const workout = await prisma.workout.create({
        data: {
          title: "Leg Day",
          scheduledAt: new Date(),
          userId,
        },
      });

      const category = await prisma.exerciseCategory.create({
        data: { name: "Strength" },
      });

      const exercise = await prisma.exercise.create({
        data: {
          name: "Squat",
          categoryId: category.id,
        },
      });

      const workoutExercise = await prisma.workoutExercise.create({
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

      const deletedWorkoutExercise = await prisma.workoutExercise.findUnique({
        where: { id: workoutExercise.id },
      });
      expect(deletedWorkoutExercise).toBeNull();
    });
  });

  describe("PATCH /api/workouts/:workoutId/exercises/:workoutExerciseId", () => {
    it("should update exercise completion status successfully", async () => {
      const workout = await prisma.workout.create({
        data: {
          title: "Leg Day",
          scheduledAt: new Date(),
          userId,
        },
      });

      const category = await prisma.exerciseCategory.create({
        data: { name: "Strength" },
      });

      const exercise = await prisma.exercise.create({
        data: {
          name: "Squat",
          categoryId: category.id,
        },
      });

      const workoutExercise = await prisma.workoutExercise.create({
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
      const workout = await prisma.workout.create({
        data: {
          title: "Leg Day",
          scheduledAt: new Date(),
          userId,
        },
      });

      const category = await prisma.exerciseCategory.create({
        data: { name: "Strength" },
      });

      const e1 = await prisma.exercise.create({
        data: { name: "Squat", categoryId: category.id },
      });
      const e2 = await prisma.exercise.create({
        data: { name: "Bench", categoryId: category.id },
      });

      const we1 = await prisma.workoutExercise.create({
        data: { workoutId: workout.id, exerciseId: e1.id, sequence: 1 },
      });
      const we2 = await prisma.workoutExercise.create({
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

      if (response.status !== 200) {
        console.log(JSON.stringify(response.body, null, 2));
      }
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Exercises reordered successfully");

      const updatedWe1 = await prisma.workoutExercise.findUnique({ where: { id: we1.id } });
      const updatedWe2 = await prisma.workoutExercise.findUnique({ where: { id: we2.id } });

      expect(updatedWe1?.sequence).toBe(2);
      expect(updatedWe2?.sequence).toBe(1);
    });
  });
});
