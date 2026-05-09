import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExerciseService } from "../../src/services/exercise.service.js";
import { prisma } from "../../src/lib/db.js";
import { ResourceNotFoundError } from "../../src/lib/errors.js";

vi.mock("../../src/lib/db.js", () => ({
  prisma: {
    exercise: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("ExerciseService", () => {
  const service = new ExerciseService();
  const userId = "user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list system and user exercises", async () => {
    vi.mocked(prisma.exercise.findMany).mockResolvedValue([]);
    await service.list(userId);
    expect(prisma.exercise.findMany).toHaveBeenCalledWith({
      where: { OR: [{ isSystem: true }, { ownerId: userId }] },
      include: { category: true },
    });
  });

  it("should throw ResourceNotFoundError if exercise not found or unauthorized", async () => {
    vi.mocked(prisma.exercise.findFirst).mockResolvedValue(null);
    await expect(service.getById("ex-1", userId)).rejects.toThrow(ResourceNotFoundError);
  });

  it("should create a custom exercise", async () => {
    const data = { name: "Test Ex", categoryId: "cat-1" };
    vi.mocked(prisma.exercise.create).mockResolvedValue({ id: "ex-1", ...data, description: null, isSystem: false, ownerId: userId, muscleGroup: null });
    
    const result = await service.create(userId, data);
    expect(result.ownerId).toBe(userId);
    expect(prisma.exercise.create).toHaveBeenCalledWith({
      data: { ...data, isSystem: false, ownerId: userId },
    });
  });
});
