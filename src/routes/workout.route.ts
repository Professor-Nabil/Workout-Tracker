import { Router } from "express";
import { create, list, getById, update, softDelete, addExercise, removeExercise, updateExerciseStatus, reorderExercises } from "../controllers/workout.controller.js";
import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";
import { createWorkoutSchema, updateWorkoutSchema, addExerciseSchema, updateExerciseStatusSchema, reorderExercisesSchema } from "../schemas/workout.schema.js";

const router = Router();

router.use(auth);

router.post("/", validate({ body: createWorkoutSchema }), create);
router.get("/", list);
router.get("/:id", getById);
router.patch("/:id", validate({ body: updateWorkoutSchema }), update);
router.delete("/:id", softDelete);
router.post("/:workoutId/exercises", validate({ body: addExerciseSchema }), addExercise);
router.patch("/:workoutId/exercises/reorder", validate({ body: reorderExercisesSchema }), reorderExercises);
router.patch("/:workoutId/exercises/:workoutExerciseId", validate({ body: updateExerciseStatusSchema }), updateExerciseStatus);
router.delete("/:workoutId/exercises/:workoutExerciseId", removeExercise);

export default router;
