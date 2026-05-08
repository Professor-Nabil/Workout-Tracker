import jwt from 'jsonwebtoken';
import { env } from '../lib/env.js';
import { prisma } from '../lib/db.js';

export class AuthService {
  async generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async revokeRefreshToken(token: string) {
    await prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true },
    });
  }

  async refreshAccessToken(refreshToken: string) {
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.isRevoked || tokenRecord.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const accessToken = jwt.sign({ userId: tokenRecord.userId }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    return { accessToken };
  }
}
