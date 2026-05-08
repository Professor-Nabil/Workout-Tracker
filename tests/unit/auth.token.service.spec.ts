import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../../src/services/auth.service.js";
import { prisma } from "../../src/lib/db.js";
import type { RefreshToken, User } from "../../src/generated/client/client.js";
import { AuthenticationError } from "../../src/lib/errors.js";

vi.mock("../../src/lib/db.js", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn((payload) => `token-${payload.userId}`),
  },
}));

describe("AuthService", () => {
  const authService = new AuthService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should generate access and refresh tokens", async () => {
    const userId = "user-123";
    const mockToken: RefreshToken = {
      id: "rt-123",
      token: "some-token",
      userId,
      expiresAt: new Date(),
      isRevoked: false,
      createdAt: new Date(),
    };
    vi.mocked(prisma.refreshToken.create).mockResolvedValue(mockToken);

    const result = await authService.generateTokens(userId);

    expect(result.accessToken).toBe("token-user-123");
    expect(result.refreshToken).toBe("token-user-123");
    expect(prisma.refreshToken.create).toHaveBeenCalled();
  });

  it("should revoke a refresh token", async () => {
    vi.mocked(prisma.refreshToken.update).mockResolvedValue({} as RefreshToken);

    await authService.revokeRefreshToken("token-123");

    expect(prisma.refreshToken.update).toHaveBeenCalledWith({
      where: { token: "token-123" },
      data: { isRevoked: true },
    });
  });

  it("should refresh access token if refresh token is valid", async () => {
    const userId = "user-123";
    const refreshToken = "valid-token";
    const mockTokenRecord = {
      id: "rt-123",
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 10000),
      isRevoked: false,
      createdAt: new Date(),
      user: { id: userId, email: "test@test.com", password: "...", createdAt: new Date(), updatedAt: new Date() } as User,
    } as RefreshToken & { user: User };

    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(mockTokenRecord);

    const result = await authService.refreshAccessToken(refreshToken);

    expect(result.accessToken).toBe(`token-${userId}`);
  });

  it("should throw AuthenticationError if refresh token is invalid or expired", async () => {
    vi.mocked(prisma.refreshToken.findUnique).mockResolvedValue(null);

    await expect(authService.refreshAccessToken("expired-token")).rejects.toThrow(AuthenticationError);
  });
});
