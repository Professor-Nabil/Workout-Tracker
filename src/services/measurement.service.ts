import { prisma } from "../lib/db.js";
import { ResourceNotFoundError } from "../lib/errors.js";

export interface CreateMeasurementInput {
  weight: number;
  date?: Date;
  notes?: string;
}

export interface UpdateMeasurementInput {
  weight?: number;
  date?: Date;
  notes?: string;
}

export class MeasurementService {
  async list(userId: string) {
    return await prisma.bodyMeasurement.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
  }

  async getById(id: string, userId: string) {
    const measurement = await prisma.bodyMeasurement.findFirst({
      where: { id, userId },
    });

    if (!measurement) {
      throw new ResourceNotFoundError("Measurement not found");
    }

    return measurement;
  }

  async create(userId: string, data: CreateMeasurementInput) {
    return await prisma.bodyMeasurement.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateMeasurementInput) {
    const measurement = await prisma.bodyMeasurement.findFirst({
      where: { id, userId },
    });

    if (!measurement) {
      throw new ResourceNotFoundError("Measurement not found");
    }

    return await prisma.bodyMeasurement.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    const measurement = await prisma.bodyMeasurement.findFirst({
      where: { id, userId },
    });

    if (!measurement) {
      throw new ResourceNotFoundError("Measurement not found");
    }

    return await prisma.bodyMeasurement.delete({
      where: { id },
    });
  }
}
