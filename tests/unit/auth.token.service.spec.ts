import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../../src/services/auth.service.js";
import { prisma } from "../../src/lib/db.js";
import type { RefreshToken } from "../../src/generated/client/client.js";

vi.mock("../../src/lib/db.js", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
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
});
