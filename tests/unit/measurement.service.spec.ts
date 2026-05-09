import { describe, it, expect, vi, beforeEach } from "vitest";
import { MeasurementService } from "../../src/services/measurement.service.js";
import { prisma } from "../../src/lib/db.js";

vi.mock("../../src/lib/db.js", () => ({
  prisma: {
    bodyMeasurement: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("MeasurementService", () => {
  const service = new MeasurementService();
  const userId = "user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list measurements", async () => {
    vi.mocked(prisma.bodyMeasurement.findMany).mockResolvedValue([]);
    await service.list(userId);
    expect(prisma.bodyMeasurement.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { date: "desc" },
    });
  });

  it("should get measurement by id", async () => {
    const mockMeasurement = { id: "m-1", weight: 70, userId, date: new Date(), notes: null };
    vi.mocked(prisma.bodyMeasurement.findFirst).mockResolvedValue(mockMeasurement);
    const result = await service.getById("m-1", userId);
    expect(result).toEqual(mockMeasurement);
  });

  it("should create a measurement", async () => {
    const data = { weight: 70 };
    vi.mocked(prisma.bodyMeasurement.create).mockResolvedValue({ id: "m-1", weight: 70, userId, date: new Date(), notes: null });
    await service.create(userId, data);
    expect(prisma.bodyMeasurement.create).toHaveBeenCalledWith({ data: { ...data, userId } });
  });

  it("should update a measurement", async () => {
    const mockMeasurement = { id: "m-1", weight: 70, userId, date: new Date(), notes: null };
    vi.mocked(prisma.bodyMeasurement.findFirst).mockResolvedValue(mockMeasurement);
    vi.mocked(prisma.bodyMeasurement.update).mockResolvedValue({ ...mockMeasurement, weight: 75 });

    const result = await service.update("m-1", userId, { weight: 75 });
    expect(result.weight).toBe(75);
  });

  it("should delete a measurement", async () => {
    vi.mocked(prisma.bodyMeasurement.findFirst).mockResolvedValue({ id: "m-1", userId, weight: 70, date: new Date(), notes: null });
    await service.delete("m-1", userId);
    expect(prisma.bodyMeasurement.delete).toHaveBeenCalledWith({ where: { id: "m-1" } });
  });
});
