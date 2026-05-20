import db from "../../../lib/db.js";
import bcrypt from "bcrypt";

export const signupService = async (email: string, password: string) => {
  const hashPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      email,
      hashPassword,
    },
    select: {
      email: true,
      id: true,
    },
  });

  return { user };
};
