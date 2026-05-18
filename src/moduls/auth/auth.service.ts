import db from "../../lib/db.js";
import type { UserSchema } from "./auth.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../lib/env.js";
import { AppError } from "../../errors/app.error.js";

// Helper function to issue both tokens and record the refresh token in the DB
const generateAndSaveTokens = async (userId: string) => {
  // 1. Sign Access Token (Short lifespan)
  const accessToken = jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  // 2. Sign Refresh Token (Long lifespan)
  const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  // 3. Calculate database expiration date (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  // 4. Save the refresh token to the database
  await db.refreshToken.create({
    data: {
      token: refreshToken,
      userId: userId,
      expiresAt: expiresAt,
    },
  });
  return { accessToken, refreshToken };
};

export const sginupService = async (User: UserSchema) => {
  const { email, password } = User;

  const hashPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      email,
      hashPassword,
    },
    select: {
      id: true,
      email: true,
    },
  });

  // Generate our token pair
  const { accessToken, refreshToken } = await generateAndSaveTokens(user.id);

  return { user, accessToken, refreshToken };
};

export const loginService = async (User: UserSchema) => {
  const { email, password } = User;

  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      hashPassword: true,
    },
  });

  if (!user) {
    throw new AppError("Wrong email or password", 404);
  }

  const validPassword = await bcrypt.compare(password, user.hashPassword);

  if (!validPassword) {
    throw new AppError("Wrong email or password", 404);
  }

  // Generate our token pair
  const { accessToken, refreshToken } = await generateAndSaveTokens(user.id);

  return { user, accessToken, refreshToken };
};

interface JwtPayload {
  id: string;
}

export const refreshSessionService = async (incomingRefreshToken: string) => {
  let decoded: JwtPayload;

  // 1. Verify that the refresh token is authentic and hasn't expired cryptographically
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      env.JWT_REFRESH_SECRET,
    ) as JwtPayload;
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  // 2. Look up the token in our database table
  const storedToken = await db.refreshToken.findUnique({
    where: { token: incomingRefreshToken },
  });

  // Security Guard: If it's missing from DB or its hard date has passed, block access!
  if (!storedToken || storedToken.expiresAt < new Date()) {
    if (storedToken) {
      // Clean up the stale db record if it expired naturally
      await db.refreshToken.delete({ where: { id: storedToken.id } });
    }
    throw new AppError("Session expired, please log in again", 401);
  }

  // 3. THE REFRESH ROTATION SYSTEM (Delete old token, replace with brand new pair)
  await db.refreshToken.delete({
    where: { id: storedToken.id },
  });

  // Use our helper to roll the timeline forward (creates fresh accessToken + 7-day database record)
  const tokens = await generateAndSaveTokens(decoded.id);

  return tokens;
};

export const logoutSessionService = async (incomingRefreshToken: string) => {
  // If no token is provided, do nothing or assume already logged out
  if (!incomingRefreshToken) return;

  // Kill the session completely by deleting it from the database table
  try {
    await db.refreshToken.deleteMany({
      where: { token: incomingRefreshToken },
    });
  } catch (err) {
    // Fail silently or handle cleanly—it means the token was already deleted or doesn't exist
  }
};
