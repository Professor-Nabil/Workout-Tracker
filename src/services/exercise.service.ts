import { prisma } from "../lib/db.js";
import { ResourceNotFoundError } from "../lib/errors.js";

export interface CreateExerciseInput {
  name: string;
  description?: string;
  categoryId: string;
  muscleGroup?: string;
}

export interface UpdateExerciseInput {
  name?: string;
  description?: string;
  categoryId?: string;
  muscleGroup?: string;
}

export class ExerciseService {
  async list(userId: string) {
    return await prisma.exercise.findMany({
      where: {
        OR: [{ isSystem: true }, { ownerId: userId }],
      },
      include: { category: true },
    });
  }

  async getById(id: string, userId: string) {
    const exercise = await prisma.exercise.findFirst({
      where: {
        id,
        OR: [{ isSystem: true }, { ownerId: userId }],
      },
      include: { category: true },
    });

    if (!exercise) {
      throw new ResourceNotFoundError("Exercise not found or unauthorized");
    }

    return exercise;
  }

  async create(userId: string, data: CreateExerciseInput) {
    return await prisma.exercise.create({
      data: {
        ...data,
        isSystem: false,
        ownerId: userId,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateExerciseInput) {
    const exercise = await prisma.exercise.findFirst({
      where: { id, ownerId: userId, isSystem: false },
    });

    if (!exercise) {
      throw new ResourceNotFoundError("Exercise not found or cannot be updated");
    }

    return await prisma.exercise.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    const exercise = await prisma.exercise.findFirst({
      where: { id, ownerId: userId, isSystem: false },
    });

    if (!exercise) {
      throw new ResourceNotFoundError("Exercise not found or cannot be deleted");
    }

    return await prisma.exercise.delete({
      where: { id },
    });
  }
}
