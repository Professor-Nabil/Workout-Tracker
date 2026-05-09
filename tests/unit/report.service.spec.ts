import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReportService } from "../../src/services/report.service.js";
import { prisma } from "../../src/lib/db.js";
import { WorkoutStatus } from "../../src/generated/client/enums.js";

vi.mock("../../src/lib/db.js", () => ({
  prisma: {
    workout: { findMany: vi.fn() },
    bodyMeasurement: { findMany: vi.fn() },
  },
}));

describe("ReportService", () => {
  const service = new ReportService();
  const userId = "user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should aggregate workout summary", async () => {
    const mockWorkouts = [
      {
        status: WorkoutStatus.COMPLETED,
        createdAt: new Date(),
        exercises: [
          { duration: 30, exercise: { category: { name: "Cardio" } } },
        ],
      },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.workout.findMany).mockResolvedValue(mockWorkouts as any);

    const result = await service.getWorkoutSummary(userId, new Date(), new Date());
    expect(result.totalWorkouts).toBe(1);
    expect(result.totalDuration).toBe(30);
    expect(result.categoryBreakdown).toEqual({ Cardio: 1 });
  });

  it("should get weight progress", async () => {
    const mockMeasurements = [{ id: "m-1", weight: 70, date: new Date(), userId, notes: null }];
    vi.mocked(prisma.bodyMeasurement.findMany).mockResolvedValue(mockMeasurements);

    const result = await service.getWeightProgress(userId, new Date(), new Date());
    expect(result).toEqual(mockMeasurements);
  });
});
