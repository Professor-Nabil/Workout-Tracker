import db from "../../lib/db.js";
import type { UserSchema } from "./auth.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../lib/env.js";
import { AppError } from "../../errors/app.error.js";

export const sginupService = async (User: UserSchema) => {
  const { email, password } = User;

  const hashPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      email,
      hashPassword,
    },
    select: {
      id: true,
      email: true,
    },
  });

  const token = jwt.sign(user.id, env.JWT_SECRET);

  return { user, token };
};

export const loginService = async (User: UserSchema) => {
  const { email, password } = User;

  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      hashPassword: true,
    },
  });

  if (!user) {
    throw new AppError("Wrong email or password", 404);
  }

  const validPassword = await bcrypt.compare(password, user.hashPassword);

  if (!validPassword) {
    throw new AppError("Wrong email or password", 404);
  }

  const token = jwt.sign(user.id, env.JWT_SECRET);

  return { user, token };
};
