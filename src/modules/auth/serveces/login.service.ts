import { AppError } from "../../../errors/app.error.js";
import db from "../../../lib/db.js";
import bcrypt from "bcrypt";
import { generateTokens } from "./helpers/generateTokens.js";

export const loginService = async (email: string, password: string) => {
  // -------------------------------------------------------------
  // Find user
  const result = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      hashPassword: true,
    },
  });

  if (!result) {
    throw new AppError("Invalid email or password", 400);
  }

  // -------------------------------------------------------------
  // Validate password
  const isValidPasswd = await bcrypt.compare(password, result.hashPassword);

  if (!isValidPasswd) {
    throw new AppError("Invalid email or password", 400);
  }

  const user = { id: result.id, email: result.email };

  // -------------------------------------------------------------
  // Generate tokens
  const { accessToken, refreshToken, hashRefreshToken, expiresAt } =
    await generateTokens(user.id);

  // -------------------------------------------------------------
  // Save hashToken on database
  await db.refreshToken.create({
    data: {
      userId: user.id,
      hashToken: hashRefreshToken,
      expirersAt: expiresAt,
    },
  });

  return { user, accessToken, refreshToken };
};
