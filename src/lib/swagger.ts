// import { OpenAPIGenerator } from "zod-to-openapi";
// import "zod-to-openapi/dist/zod-extensions.js";
// import { authSchema, tokenSchema } from "../schemas/auth.schema.js";
// import { createExerciseSchema, updateExerciseSchema } from "../schemas/exercise.schema.js";
// import { createMeasurementSchema, updateMeasurementSchema } from "../schemas/measurement.schema.js";
// import { createWorkoutSchema, updateWorkoutSchema } from "../schemas/workout.schema.js";

export function generateOpenApiDocument() {
  return {
    openapi: "3.0.0",
    info: {
      title: "Workout Tracker API",
      version: "1.0.0",
      description: "API documentation for the Workout Tracker application",
    },
    servers: [{ url: "/api" }],
    components: {
      schemas: {},
    },
    paths: {},
  };
}
