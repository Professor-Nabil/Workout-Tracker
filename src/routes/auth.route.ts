import { Router } from "express";
import { signup, login, refresh, logout } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { authSchema, tokenSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/signup", validate({ body: authSchema }), signup);
router.post("/login", validate({ body: authSchema }), login);
router.post("/refresh", validate({ body: tokenSchema }), refresh);
router.post("/logout", validate({ body: tokenSchema }), logout);

export default router;
