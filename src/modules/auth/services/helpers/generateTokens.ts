import jwt from "jsonwebtoken";
import env from "../../../../lib/env.schema.js";
import crypto from "crypto";

// Tokens life
const accessLife = 60 * 15; // NOTE: 15 Minutes ------------> By Seconds
const refreshLife = 60 * 60 * 24 * 7; // NOTE: 7 Days ------> By Seconds
const dbRefreshLife = refreshLife * 1000; // NOTE: 7 Days --> By Milliseconds

const accessSecret = env.JWT_ACCESS_SECRET;
const refreshSecret = env.JWT_REFRESH_SECRET;

const myGenerateTokens = (
  userId: string,
  secret: string,
  expiresIn: number,
) => {
  return jwt.sign(
    {
      userId,
      jti: crypto.randomUUID(),
    },
    secret,
    { expiresIn }, // NOTE: jwt.sign reads numbers as seconds
  );
};

export const hashTokenHelper = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const myExpiresAt = (life: number) => new Date(Date.now() + life); // NOTE: Milliseconds

export const generateTokens = async (userId: string) => {
  const accessToken = myGenerateTokens(userId, accessSecret, accessLife);
  const refreshToken = myGenerateTokens(userId, refreshSecret, refreshLife);
  const hashRefreshToken = hashTokenHelper(refreshToken);

  const expiresAt = myExpiresAt(dbRefreshLife); // NOTE: Milliseconds

  return { accessToken, refreshToken, hashRefreshToken, expiresAt };
};
