import { Router } from "express";
import { getProgress } from "../controllers/report.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.use(auth);

router.get("/progress", getProgress);

export default router;
