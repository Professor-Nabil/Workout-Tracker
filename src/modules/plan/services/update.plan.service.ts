import db from "../../../lib/db.js";
import type { PlanUpdateSchema } from "../plan.schema.js";

export const updatePlanService = async (
  planId: string,
  planExerciseList: PlanUpdateSchema,
) => {
  // -------------------------------------------------------------
  // THE ACID TRANSACTION ENGINE (The Service implementation)
  // -------------------------------------------------------------
  const result = await db.$transaction(async (tx) => {
    // Step A: Wipe out all existing child links using incoming request payload ID
    await tx.planExercise.deleteMany({
      where: { planId },
    });

    // Step B: Update parent fields and insert the clean child array
    const updatedPlan = await tx.plan.update({
      where: { id: planId },
      data: {
        title: planExerciseList.title,
        planExercise: {
          createMany: {
            data: planExerciseList.planExercises.map((ex) => ({
              exerciseId: ex.exerciseId,
              // Fixed: Explicit type safety layer mappings to prevent Prisma compile conflicts
              weight: ex.weight ?? null,
              period: ex.period ?? null,
              sets: ex.sets ?? null,
              reps: ex.reps ?? null,
            })),
          },
        },
      },
      include: {
        planExercise: {
          include: { exercise: { include: { category: true, tool: true } } },
        },
      },
    });

    return updatedPlan;
  });

  return result;
};
