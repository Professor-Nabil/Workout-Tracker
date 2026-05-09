import type { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service.js";

const categoryService = new CategoryService();

export const listCategories = async (
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const categories = await categoryService.list();
  res.status(200).json(categories);
};
