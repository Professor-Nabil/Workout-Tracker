import { describe, it, expect, vi, beforeEach } from "vitest";
import { CategoryService } from "../../src/services/category.service.js";
import { prisma } from "../../src/lib/db.js";

vi.mock("../../src/lib/db.js", () => ({
  prisma: {
    exerciseCategory: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("CategoryService", () => {
  const service = new CategoryService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list all categories", async () => {
    vi.mocked(prisma.exerciseCategory.findMany).mockResolvedValue([]);
    await service.list();
    expect(prisma.exerciseCategory.findMany).toHaveBeenCalledWith({
      orderBy: { name: "asc" },
    });
  });

  it("should get a category by id", async () => {
    const mockCategory = { id: "cat-1", name: "Cardio" };
    vi.mocked(prisma.exerciseCategory.findUnique).mockResolvedValue(mockCategory);
    
    const result = await service.getById("cat-1");
    expect(result).toEqual(mockCategory);
    expect(prisma.exerciseCategory.findUnique).toHaveBeenCalledWith({
      where: { id: "cat-1" },
    });
  });
});
