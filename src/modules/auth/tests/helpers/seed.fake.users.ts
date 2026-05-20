import { fakeUser } from "./fake.data.helper.js";
import db from "../../../../lib/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import env from "../../../../lib/env.schema.js";
import jwt from "jsonwebtoken";

//==============================================================
export const seedRealUser = async () => {
  const { email, password } = fakeUser();

  const hashPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({ data: { email, hashPassword } });

  return { email, password, id: user.id };
};

//==============================================================
export const seedRefreshToken = async (userId: string) => {
  // -------------------------------------------------------------
  // Create tokens
  const refreshTokenLife = 1000 * 60 * 60 * 24 * 7;

  const refreshToken = jwt.sign(
    { id: userId, jti: crypto.randomUUID() },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: refreshTokenLife,
    },
  );

  // -------------------------------------------------------------
  // Create Hash refreshToken and expirersAt
  const hashToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const expirersAt = new Date(Date.now() + refreshTokenLife);

  // -------------------------------------------------------------
  // Save hashToken on database
  const databaseToken = await db.refreshToken.create({
    data: {
      userId,
      hashToken,
      expirersAt,
    },
  });

  // -------------------------------------------------------------
  return { databaseToken, originalRefreshToken: refreshToken };
};
