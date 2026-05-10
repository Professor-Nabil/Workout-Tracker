import { Router } from "express";
import { list, create, update, remove } from "../controllers/measurement.controller.js";
import { validate } from "../middlewares/validate.js";
import { auth } from "../middlewares/auth.js";
import { createMeasurementSchema, updateMeasurementSchema } from "../schemas/measurement.schema.js";

const router = Router();

router.use(auth);

router.get("/", list);
router.post("/", validate({ body: createMeasurementSchema }), create);
router.patch("/:id", validate({ body: updateMeasurementSchema }), update);
router.delete("/:id", remove);

export default router;
