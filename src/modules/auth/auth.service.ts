import db from "../../lib/db.js";

export const createUser = async (email: string, password: string) => {
  const user = await db.user.create({
    data: {
      email,
      hashPassword: password,
    },
    select: {
      email: true,
      id: true,
    },
  });

  return { user };
};
