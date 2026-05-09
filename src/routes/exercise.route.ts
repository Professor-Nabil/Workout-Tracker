import { Router } from "express";
import { listCategories } from "../controllers/exercise.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.use(auth);

router.get("/categories", listCategories);

export default router;
