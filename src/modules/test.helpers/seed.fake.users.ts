import { fakeUser } from "./fake.data.helper.js";
import db from "../../lib/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import env from "../../lib/env.schema.js";
import jwt from "jsonwebtoken";

//==============================================================
export const seedRealUser = async () => {
  const { email, password } = fakeUser();

  const hashPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({ data: { email, hashPassword } });

  return { email, password, id: user.id, hashPassword };
};

//==============================================================
export const seedRefreshToken = async (userId: string) => {
  // -------------------------------------------------------------
  // Create refreshToken
  const refreshTokenLife = 1000 * 60 * 60 * 24 * 7;

  const refreshToken = jwt.sign(
    { id: userId, jti: crypto.randomUUID() },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: refreshTokenLife,
    },
  );

  // -------------------------------------------------------------
  // Create accessToken
  const acceessTokenLife = 1000 * 60 * 15;

  const accessToken = jwt.sign(
    { id: userId, jti: crypto.randomUUID() },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: acceessTokenLife,
    },
  );

  // -------------------------------------------------------------
  // Create Hash refreshToken and expiresAt
  const hashRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + refreshTokenLife);

  // -------------------------------------------------------------
  // Save hashRefreshToken on database
  const databaseToken = await db.refreshToken.create({
    data: {
      userId,
      hashRefreshToken,
      expiresAt,
    },
  });

  // -------------------------------------------------------------
  return { databaseToken, originalRefreshToken: refreshToken, accessToken };
};
