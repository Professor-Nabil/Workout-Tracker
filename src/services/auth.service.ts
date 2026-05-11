import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/db.js";
import { env } from "../lib/env.js";
import { AuthenticationError } from "../lib/errors.js";
import crypto from "crypto";

export class AuthService {
  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AuthenticationError();

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AuthenticationError();

    return user;
  }

  async generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async revokeRefreshToken(token: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    await prisma.refreshToken.update({
      where: { token: hashedToken },
      data: { isRevoked: true },
    });
  }

  async refreshAccessToken(refreshToken: string) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (
      !tokenRecord ||
      tokenRecord.isRevoked ||
      tokenRecord.expiresAt < new Date()
    ) {
      throw new AuthenticationError("Invalid or expired refresh token");
    }

    const accessToken = jwt.sign(
      { userId: tokenRecord.userId },
      env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    return { accessToken };
  }
}
