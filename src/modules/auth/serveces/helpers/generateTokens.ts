import jwt from "jsonwebtoken";
import env from "../../../../lib/env.schema.js";
import crypto from "crypto";

// Tokens life
const accessLife = 1000 * 60 * 15;
const refreshLife = 1000 * 60 * 60 * 24 * 7;
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
    { expiresIn },
  );
};

const myHashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const myExpiresAt = (life: number) => new Date(Date.now() + life);

export const generateTokens = async (userId: string) => {
  const accessToken = myGenerateTokens(userId, accessSecret, accessLife);
  const refreshToken = myGenerateTokens(userId, refreshSecret, refreshLife);
  const hashRefreshToken = myHashToken(refreshToken);
  const expiresAt = myExpiresAt(refreshLife);

  return { accessToken, refreshToken, hashRefreshToken, expiresAt };
};
