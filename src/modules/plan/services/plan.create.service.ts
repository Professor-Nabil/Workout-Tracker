import db from "../../../lib/db.js";
import type { CreateWorkoutPlanInput } from "../plan.schema.js";

export const planCreateService = async (plan: CreateWorkoutPlanInput) => {
  const result = await db.plan.create({
    data: {
      userId: plan.userId,
      title: plan.title,
      planExercise: {
        createMany: {
          data: plan.planExercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            period: ex.period ?? null,
            weight: ex.weight ?? null,
            sets: ex.sets ?? null,
            reps: ex.reps ?? null,
          })),
        },
      },
    },
    include: {
      planExercise: true,
    },
  });

  return result;
};
