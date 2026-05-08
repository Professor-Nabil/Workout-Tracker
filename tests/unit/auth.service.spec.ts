import { describe, it, expect, vi } from "vitest";
import { AuthService } from "../../src/services/auth.service.js";
import { prisma } from "../../src/lib/db.js";
import bcrypt from "bcrypt";
import type { User } from "../../src/generated/client/client.js";

// Mocking dependencies
vi.mock("../../src/lib/db.js", () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

describe("AuthService", () => {
  const authService = new AuthService();

  it("should register a user with a hashed password", async () => {
    const email = "test@example.com";
    const password = "password123";
    const hashedPassword = "hashedPassword";

    vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never);
    
    // Create a partial user object that matches the minimal requirements
    const mockUser: User = {
      id: "user-123",
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.user.create).mockResolvedValue(mockUser);

    const result = await authService.register(email, password);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { email, password: hashedPassword },
    });
    expect(result).toEqual(mockUser);
  });
});
