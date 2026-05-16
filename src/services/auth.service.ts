import db from "../lib/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import env from "../lib/env.schema.js";

export const signupService = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: { email, password: hashedPassword },
    select: { id: true, email: true },
  });

  const token = jwt.sign(user.id, env.JWT_SECRET);

  return { user, token };
};
