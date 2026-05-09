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
      update: vi.fn(),
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

  it("should update a custom exercise", async () => {
    const data = { name: "Updated Ex" };
    const mockExercise = { 
        id: "ex-1", 
        name: "Old Ex", 
        categoryId: "cat-1", 
        ownerId: userId, 
        isSystem: false, 
        description: null, 
        muscleGroup: null 
    };
    
    vi.mocked(prisma.exercise.findFirst).mockResolvedValue(mockExercise);
    vi.mocked(prisma.exercise.update).mockResolvedValue({ ...mockExercise, ...data });

    const result = await service.update("ex-1", userId, data);
    expect(result.name).toBe("Updated Ex");
    expect(prisma.exercise.update).toHaveBeenCalledWith({
      where: { id: "ex-1" },
      data,
    });
  });
});
