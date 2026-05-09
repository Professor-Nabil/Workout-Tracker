import { prisma } from "../lib/db.js";
import { ResourceNotFoundError } from "../lib/errors.js";
import { WorkoutStatus } from "../generated/client/enums.js";

export interface CreateWorkoutInput {
  title: string;
  scheduledAt: Date;
  userId: string;
}

export interface UpdateWorkoutInput {
  title?: string;
  status?: WorkoutStatus;
  scheduledAt?: Date;
  comments?: string;
}

export class WorkoutService {
  async create(data: CreateWorkoutInput) {
    return await prisma.workout.create({
      data: {
        title: data.title,
        scheduledAt: data.scheduledAt,
        userId: data.userId,
      },
    });
  }

  async list(userId: string) {
    return await prisma.workout.findMany({
      where: { userId, deletedAt: null },
      orderBy: { scheduledAt: "desc" },
    });
  }

  async getById(id: string, userId: string) {
    const workout = await prisma.workout.findFirst({
      where: { id, userId, deletedAt: null },
      include: { exercises: { include: { exercise: true } } },
    });

    if (!workout) {
      throw new ResourceNotFoundError("Workout not found");
    }

    return workout;
  }

  async update(id: string, userId: string, data: UpdateWorkoutInput) {
    const workout = await prisma.workout.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!workout) {
      throw new ResourceNotFoundError("Workout not found");
    }

    return await prisma.workout.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string, userId: string) {
    const workout = await prisma.workout.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!workout) {
      throw new ResourceNotFoundError("Workout not found");
    }

    return await prisma.workout.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
