import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db.js';
import { env } from '../lib/env.js';

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
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    return user;
  }

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
}
