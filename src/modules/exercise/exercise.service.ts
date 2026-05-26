import db from "../../lib/db.js";

export const readAllExerciseService = async () => {
  const result = await db.exercise.findMany({});
  return result;
};
