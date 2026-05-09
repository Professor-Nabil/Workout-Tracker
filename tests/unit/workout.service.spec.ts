import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorkoutService } from "../../src/services/workout.service.js";
import { prisma } from "../../src/lib/db.js";
import { ResourceNotFoundError } from "../../src/lib/errors.js";
import type { Workout } from "../../src/generated/client/client.js";

vi.mock("../../src/lib/db.js", () => ({
  prisma: {
    workout: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("WorkoutService", () => {
  const service = new WorkoutService();
  const userId = "user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a workout", async () => {
    const data = { title: "Test Workout", scheduledAt: new Date(), userId };
    const mockWorkout: Workout = {
      id: "w-1",
      title: "Test Workout",
      scheduledAt: new Date(),
      userId,
      status: "PLANNED",
      startedAt: null,
      endedAt: null,
      comments: null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vi.mocked(prisma.workout.create).mockResolvedValue(mockWorkout);

    const result = await service.create(data);
    expect(result.id).toBe("w-1");
    expect(prisma.workout.create).toHaveBeenCalledWith({ data });
  });

  it("should list workouts for a user", async () => {
    const mockWorkouts: Workout[] = [{ 
        id: "w-1", 
        title: "Test", 
        scheduledAt: new Date(), 
        userId, 
        status: "PLANNED", 
        startedAt: null, 
        endedAt: null, 
        comments: null, 
        deletedAt: null, 
        createdAt: new Date(), 
        updatedAt: new Date() 
    }];
    vi.mocked(prisma.workout.findMany).mockResolvedValue(mockWorkouts);

    const result = await service.list(userId);
    expect(result).toHaveLength(1);
    expect(prisma.workout.findMany).toHaveBeenCalledWith({ where: { userId, deletedAt: null }, orderBy: { scheduledAt: "desc" } });
  });

  it("should update a workout", async () => {
    const updateData = { title: "Updated" };
    const mockWorkout: Workout = { 
        id: "w-1", 
        title: "Updated", 
        scheduledAt: new Date(), 
        userId, 
        status: "PLANNED", 
        startedAt: null, 
        endedAt: null, 
        comments: null, 
        deletedAt: null, 
        createdAt: new Date(), 
        updatedAt: new Date() 
    };
    vi.mocked(prisma.workout.findFirst).mockResolvedValue(mockWorkout);
    vi.mocked(prisma.workout.update).mockResolvedValue(mockWorkout);

    const result = await service.update("w-1", userId, updateData);
    expect(result.title).toBe("Updated");
    expect(prisma.workout.update).toHaveBeenCalledWith({ where: { id: "w-1" }, data: updateData });
  });

  it("should soft delete a workout", async () => {
    const mockWorkout: Workout = { 
        id: "w-1", 
        title: "Test", 
        scheduledAt: new Date(), 
        userId, 
        status: "PLANNED", 
        startedAt: null, 
        endedAt: null, 
        comments: null, 
        deletedAt: null, 
        createdAt: new Date(), 
        updatedAt: new Date() 
    };
    vi.mocked(prisma.workout.findFirst).mockResolvedValue(mockWorkout);
    vi.mocked(prisma.workout.update).mockResolvedValue({ ...mockWorkout, deletedAt: new Date() });

    await service.softDelete("w-1", userId);
    expect(prisma.workout.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "w-1" } }));
  });

  it("should throw ResourceNotFoundError if workout not found on getById", async () => {
    vi.mocked(prisma.workout.findFirst).mockResolvedValue(null);

    await expect(service.getById("w-1", userId)).rejects.toThrow(
      ResourceNotFoundError,
    );
  });
});
