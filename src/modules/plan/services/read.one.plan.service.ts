import db from "../../../lib/db.js";

export const readOnePlanService = async (userId: string, planId: string) => {
  const result = await db.plan.findUnique({
    where: { id: planId },
    include: { planExercise: true },
  });

  return result;
};
