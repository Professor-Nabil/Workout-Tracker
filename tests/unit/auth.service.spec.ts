import { describe, it, expect, vi } from "vitest";
import { AuthService } from "../../src/services/auth.service.js";
import { prisma } from "../../src/lib/db.js";
import bcrypt from "bcrypt";
import type { User } from "../../src/generated/client/client.js";

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

  it("should return user if credentials are valid", async () => {
    const email = "test@example.com";
    const password = "password123";
    const hashedPassword = "hashedPassword";
    
    const mockUser: User = {
      id: "user-123",
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const user = await authService.login(email, password);
    expect(user).toEqual(mockUser);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
  });

  it("should throw error if credentials are invalid", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    
    await expect(authService.login("wrong@example.com", "wrong")).rejects.toThrow();
  });
});
