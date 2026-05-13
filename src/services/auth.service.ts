// ./src/services/auth.service.ts
import db from "../lib/db.js";
import { generateToken } from "../lib/jwt.js";

export const signupService = async (email: string, password: string) => {
  const user = await db.user.create({
    data: {
      email,
      password,
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
