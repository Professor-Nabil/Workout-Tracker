import db from "../../../lib/db.js";

export const deleteService = async (planId: string) => {
  const result = await db.plan.deleteMany({ where: { id: planId } });

  return result;
};
