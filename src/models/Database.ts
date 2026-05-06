import { type User } from "./User.js";
import { type Category } from "./Category.js";
import { type Exercise } from "./Exercise.js";

export interface Database {
  User: User[];
  Category: Category[];
  Exercise: Exercise[];
}
