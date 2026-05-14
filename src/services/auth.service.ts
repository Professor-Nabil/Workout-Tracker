// ./src/services/auth.service.ts
import db from "../lib/db.js";
import { generateToken } from "../lib/jwt.js";
import bcrypt from "bcrypt";

export const signupService = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  const token = generateToken({ sub: user.id });

  return { user, token };
};
