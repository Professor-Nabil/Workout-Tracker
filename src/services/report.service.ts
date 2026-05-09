import { prisma } from "../lib/db.js";
import { WorkoutStatus } from "../generated/client/enums.js";

export class ReportService {
  async getWorkoutSummary(userId: string, startDate: Date, endDate: Date) {
    const workouts = await prisma.workout.findMany({
      where: {
        userId,
        status: WorkoutStatus.COMPLETED,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        exercises: {
          include: {
            exercise: {
              include: { category: true },
            },
          },
        },
      },
    });

    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce(
      (sum, w) =>
        sum +
        w.exercises.reduce((exSum, ex) => exSum + (ex.duration ?? 0), 0),
      0
    );

    const categoryBreakdown = workouts.reduce((acc, w) => {
      w.exercises.forEach((ex) => {
        const cat = ex.exercise.category.name;
        acc[cat] = (acc[cat] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      totalWorkouts,
      totalDuration,
      categoryBreakdown,
    };
  }

  async getWeightProgress(userId: string, startDate: Date, endDate: Date) {
    return await prisma.bodyMeasurement.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    });
  }
}
