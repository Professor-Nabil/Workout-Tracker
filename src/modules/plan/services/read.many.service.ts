import db from "../../../lib/db.js";

export const readManyService = async (userId: string) => {
  const result = await db.plan.findMany({
    where: { userId },
    include: { planExercise: true },
  });

  return result;
};
