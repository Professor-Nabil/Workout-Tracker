import type { Request, Response, NextFunction } from "express";
import { ReportService } from "../services/report.service.js";

const reportService = new ReportService();

export const getProgress = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 1); // Last month default

  const [workoutSummary, weightProgress] = await Promise.all([
    reportService.getWorkoutSummary(req.user!.userId, startDate, endDate),
    reportService.getWeightProgress(req.user!.userId, startDate, endDate),
  ]);

  res.status(200).json({
    workoutSummary,
    weightProgress,
  });
};
