import { AppError } from "../../../errors/app.error.js";
import jwt from "jsonwebtoken";
import env from "../../../lib/env.schema.js";
import db from "../../../lib/db.js";
import { generateTokens, hashTokenHelper } from "./helpers/generateTokens.js";

const refreshSecret = env.JWT_REFRESH_SECRET;

export const refreshService = async (incommingRefreshToken: string) => {
  let uncoded;

  // 1. ONLY catch JWT validation errors here
  try {
    uncoded = jwt.verify(incommingRefreshToken, refreshSecret);
  } catch (err) {
    throw new AppError("Invalid or expired token signature", 401);
  }

  if (!uncoded || typeof uncoded === "string") {
    throw new AppError("Invalid token payload", 401);
  }

  // 2. Database operations go out here.
  // If these fail, Express will naturally throw a 500 Internal Server Error, which is correct.
  const incommingHashRefreshToken = hashTokenHelper(incommingRefreshToken);

  const result = await db.refreshToken.findUnique({
    where: { hashRefreshToken: incommingHashRefreshToken },
  });

  if (!result) {
    throw new AppError("Token not found in database", 401);
  }

  // Delete old token and create new one (Ideally inside a db.$transaction)
  await db.refreshToken.delete({
    where: { hashRefreshToken: incommingHashRefreshToken },
  });

  const { accessToken, refreshToken, hashRefreshToken, expiresAt } =
    await generateTokens(uncoded.userId);

  await db.refreshToken.create({
    data: {
      userId: uncoded.userId,
      hashRefreshToken,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
};
