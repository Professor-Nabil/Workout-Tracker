import { z } from "zod";
// Trigger prototype extension BEFORE loading OpenAPIGenerator
(z.ZodSchema.prototype as any).openapi = function (openapi: any) {
    return new (this.constructor as any)(Object.assign(Object.assign({}, (this as any)._def), { openapi }));
};
import { OpenAPIGenerator } from "zod-to-openapi";
import fs from "fs";
import path from "path";

import { authSchema, tokenSchema } from "../src/schemas/auth.schema.js";
import { createExerciseSchema, updateExerciseSchema, exerciseCategorySchema } from "../src/schemas/exercise.schema.js";
import { createMeasurementSchema, updateMeasurementSchema } from "../src/schemas/measurement.schema.js";
import { createWorkoutSchema, updateWorkoutSchema } from "../src/schemas/workout.schema.js";

const generator = new OpenAPIGenerator([
  authSchema,
  tokenSchema,
  exerciseCategorySchema,
  createExerciseSchema,
  updateExerciseSchema,
  createMeasurementSchema,
  updateMeasurementSchema,
  createWorkoutSchema,
  updateWorkoutSchema,
]);

const components = generator.generate();

const doc = {
  openapi: "3.0.0",
  info: {
    title: "Workout Tracker API",
    version: "1.0.0",
    description: "Generated API documentation",
  },
  servers: [{ url: "/api" }],
  components: {
    schemas: components,
  },
  paths: {},
};

const outputPath = path.join(process.cwd(), "dist/openapi.json");
fs.writeFileSync(outputPath, JSON.stringify(doc, null, 2));
console.log(`OpenAPI spec generated at ${outputPath}`);
