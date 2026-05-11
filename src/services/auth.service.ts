import { prisma } from "../lib/db.js";
import { ConflictError } from "../lib/errors.js";

export const authService = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError("User already exists");
  }

  const result = await prisma.user.create({
    data: {
      email,
      password,
    },
    select: {
      email: true,
    },
  });

  return result;
};
