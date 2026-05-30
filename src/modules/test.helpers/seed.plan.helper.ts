import db from "../../lib/db.js";
import type { Exercise } from "../../generated/prisma/client.js";
import { faker } from "@faker-js/faker";

export const seedOnePlan = async (userId: string) => {
  // -------------------------------------------------------------
  // Create user and find exercise
  let realExercise: Exercise;

  // 2. Fetch an exercise from your seeded database
  const exercise = await db.exercise.findFirst({});
  if (!exercise) {
    throw new Error(
      "Database health check failed: No exercises found in seed data.",
    );
  }
  realExercise = exercise;

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // Simiolate real requset body
  const reqBody = {
    // WARN: Every user should has one unique plan title
    title: "Hypertrophy Push Day", // Unique for each user
    userId,
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
  // Execute Prisma transaction creation
  const result = await db.plan.create({
    data: {
      title: reqBody.title,
      userId: reqBody.userId,
      // Prisma uses nested writes here to create the plan and relation simultaneously
      planExercise: {
        createMany: {
          data: reqBody.planExercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            period: ex.period,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
          })),
        },
      },
    },
    // Include the relation in the result so we can assert on it!
    include: {
      planExercise: true,
    },
  });
  return result;
};

export const seedManyPlan = async (userId: string) => {
  // -------------------------------------------------------------
  // Create user and find exercise
  let realExercise: Exercise[];

  realExercise = await db.exercise.findMany({
    take: 3,
  });

  if (realExercise.length < 2) {
    throw new Error(
      "Database health check failed: Please ensure your seed file inserts at least 2 or 3 exercises.",
    );
  }

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // Simiolate real requset body
  const reqBody = {
    // WARN: Every user should has one unique plan title
    title: faker.book.title(),
    userId: userId,

    planExercises: realExercise.map((exercise, index) => ({
      exerciseId: exercise.id,
      weight: 20 + index * 10, // 20kg, 30kg, 40kg
      period: 90, // 90 Minutes
      sets: 4,
      reps: 10,
    })),
  };

  // -------------------------------------------------------------
  // Execute Prisma transaction creation
  const result = await db.plan.create({
    data: {
      title: reqBody.title,
      userId: reqBody.userId,
      // Prisma uses nested writes here to create the plan and relation simultaneously
      planExercise: {
        createMany: {
          data: reqBody.planExercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            period: ex.period,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
          })),
        },
      },
    },
    // Include the relation in the result so we can assert on it!
    include: {
      planExercise: true,
    },
  });
  return result;
};
