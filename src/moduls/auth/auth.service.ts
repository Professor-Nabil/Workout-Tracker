import db from "../../lib/db.js";
import type { UserSchema } from "./auth.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../lib/env.js";

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
