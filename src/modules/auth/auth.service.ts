import { AppError } from "../../errors/app.error.js";
import db from "../../lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../lib/env.schema.js";
import crypto from "crypto";

export const createUser = async (email: string, password: string) => {
  const hashPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      email,
      hashPassword,
    },
    select: {
      email: true,
      id: true,
    },
  });

  return { user };
};

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
    throw new AppError("Wrong email or password", 404);
  }

  // -------------------------------------------------------------
  // Validate password
  const isValidPasswd = await bcrypt.compare(password, result.hashPassword);

  if (!isValidPasswd) {
    throw new AppError("Wrong email or password", 404);
  }

  const user = { id: result.id, email: result.email };

  // -------------------------------------------------------------
  // Create tokens
  const accessTokenLife = 1000 * 60 * 15;
  const refreshTokenLife = 1000 * 60 * 60 * 24 * 7;

  const accessToken = jwt.sign(
    { id: user.id, jti: crypto.randomUUID() },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: accessTokenLife,
    },
  );
  const refreshToken = jwt.sign(
    { id: user.id, jti: crypto.randomUUID() },
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
  await db.refreshToken.create({
    data: {
      userId: user.id,
      hashToken,
      expirersAt,
    },
  });

  return { user, accessToken, refreshToken };
};
