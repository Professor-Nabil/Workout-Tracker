/* ==========================================================================================
 * Database Models
 * */

class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}
class Category {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}
class Exercise {
  constructor(id, name, description, category) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
  }
}
class Exercise_Plan {
  constructor(
    id,
    exercise,
    numberOfRepetitions,
    sets,
    weights,
    exerciseTime,
    comment,
  ) {
    this.id = id;
    this.exercise = exercise;
    this.numberOfRepetitions = numberOfRepetitions;
    this.sets = sets;
    this.weights = weights;
    this.exerciseTime = exerciseTime;
    this.comment = comment;
  }
}
class Plan_Status {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}
class Workout_Plans {
  constructor(id, user, exercisePlan, planStatus) {
    this.id = id;
    this.user = user;
    this.exercisePlan = exercisePlan;
    this.planStatus = planStatus;
  }
}
class Workouts_Progress {
  constructor(id, user, numberOfCompletedExercises) {
    this.id = id;
    this.user = user;
    this.numberOfCompletedExercises = numberOfCompletedExercises;
  }
}

/* ==========================================================================================
 * Database
 * */

const Database = {
  User: [],
  Category: [],
  Exercise: [],
  Exercise_Plan: [],
  Plan_Status: [],
  Workout_Plans: [],
  Workouts_Progress: [],
};

/* ==========================================================================================
 * Database Seeding
 * */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
{
  const filePath = path.join(__dirname, "./wiki/Database-Seeding.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const exercises = JSON.parse(rawData);
  exercises.forEach((elm) => {
    Database.Exercise.push(elm);
  });
}
