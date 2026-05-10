import { Router } from "express";
import { listCategories, list, create, update, remove } from "../controllers/exercise.controller.js";
import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";
import { createExerciseSchema, updateExerciseSchema } from "../schemas/exercise.schema.js";

const router = Router();

router.use(auth);

router.get("/categories", listCategories);
router.get("/", list);
router.post("/", validate({ body: createExerciseSchema }), create);
router.patch("/:id", validate({ body: updateExerciseSchema }), update);
router.delete("/:id", remove);

export default router;
