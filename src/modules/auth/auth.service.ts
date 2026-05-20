import { AppError } from "../../errors/app.error.js";
import db from "../../lib/db.js";
import bcrypt from "bcrypt";

export const createUser = async (email: string, password: string) => {
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

export const loginService = async (email: string, password: string) => {
  const result = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      hashPassword: true,
    },
  });

  if (!result) {
    throw new AppError("Wrong email or password", 404);
  }

  const isValidPasswd = await bcrypt.compare(password, result.hashPassword);

  if (!isValidPasswd) {
    throw new AppError("Wrong email or password", 404);
  }

  const user = { id: result.id, email: result.email };
  return { user };
};
