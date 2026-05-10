import type { Request, Response, NextFunction } from "express";
import { MeasurementService } from "../services/measurement.service.js";

const measurementService = new MeasurementService();

export const list = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const measurements = await measurementService.list(req.user!.userId);
  res.status(200).json(measurements);
};

export const create = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const measurement = await measurementService.create(req.user!.userId, req.body);
  res.status(201).json(measurement);
};

export const update = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const measurement = await measurementService.update(
    req.params.id as string,
    req.user!.userId,
    req.body,
  );
  res.status(200).json(measurement);
};

export const remove = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  await measurementService.delete(req.params.id as string, req.user!.userId);
  res.status(200).json({ message: "Measurement deleted successfully" });
};
