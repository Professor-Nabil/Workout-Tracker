import { prisma } from "../lib/db.js";

export class CategoryService {
  async list() {
    return await prisma.exerciseCategory.findMany({
      orderBy: { name: "asc" },
    });
  }

  async getById(id: string) {
    return await prisma.exerciseCategory.findUnique({
      where: { id },
    });
  }
}
