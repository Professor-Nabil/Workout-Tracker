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

export interface AddExerciseInput {
  exerciseId: string;
  sequence: number;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
}

export interface ReorderExerciseInput {
  workoutExerciseId: string;
  newSequence: number;
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
      include: { exercises: { include: { exercise: true }, orderBy: { sequence: "asc" } } },
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

  async addExercise(workoutId: string, userId: string, data: AddExerciseInput) {
    return await prisma.$transaction(async (tx) => {
      const workout = await tx.workout.findFirst({
        where: { id: workoutId, userId, deletedAt: null },
      });

      if (!workout) {
        throw new ResourceNotFoundError("Workout not found");
      }

      return await tx.workoutExercise.create({
        data: {
          workoutId,
          exerciseId: data.exerciseId,
          sequence: data.sequence,
          sets: data.sets ?? null,
          reps: data.reps ?? null,
          weight: data.weight ?? null,
          duration: data.duration ?? null,
        },
      });
    });
  }

  async removeExercise(workoutExerciseId: string, userId: string) {
    const workoutExercise = await prisma.workoutExercise.findFirst({
      where: { id: workoutExerciseId, workout: { userId, deletedAt: null } },
    });

    if (!workoutExercise) {
      throw new ResourceNotFoundError("Workout exercise not found");
    }

    return await prisma.workoutExercise.delete({
      where: { id: workoutExerciseId },
    });
  }

  async reorderExercises(workoutId: string, userId: string, reorderInputs: ReorderExerciseInput[]) {
    return await prisma.$transaction(async (tx) => {
      const workout = await tx.workout.findFirst({
        where: { id: workoutId, userId, deletedAt: null },
      });

      if (!workout) {
        throw new ResourceNotFoundError("Workout not found");
      }

      for (const input of reorderInputs) {
        await tx.workoutExercise.update({
          where: { id: input.workoutExerciseId, workoutId },
          data: { sequence: input.newSequence },
        });
      }
    });
  }

  async updateExerciseStatus(workoutExerciseId: string, userId: string, isCompleted: boolean) {
    const workoutExercise = await prisma.workoutExercise.findFirst({
      where: { id: workoutExerciseId, workout: { userId, deletedAt: null } },
    });

    if (!workoutExercise) {
      throw new ResourceNotFoundError("Workout exercise not found");
    }

    return await prisma.workoutExercise.update({
      where: { id: workoutExerciseId },
      data: { isCompleted },
    });
  }

  async updateStatus(workoutId: string, userId: string, status: WorkoutStatus) {
    return await prisma.$transaction(async (tx) => {
      const workout = await tx.workout.findFirst({
        where: { id: workoutId, userId, deletedAt: null },
      });

      if (!workout) {
        throw new ResourceNotFoundError("Workout not found");
      }

      const updateData: { status: WorkoutStatus; startedAt?: Date; endedAt?: Date } = { status };
      if (status === WorkoutStatus.IN_PROGRESS) updateData.startedAt = new Date();
      if (status === WorkoutStatus.COMPLETED) updateData.endedAt = new Date();

      return await tx.workout.update({
        where: { id: workoutId },
        data: updateData,
      });
    });
  }
}
