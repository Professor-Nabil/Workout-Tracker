import { type Category } from "./Category.js";

export interface Exercise {
  id: number;
  name: string;
  description: string | undefined;
  category: Pick<Category, "name">;
}
