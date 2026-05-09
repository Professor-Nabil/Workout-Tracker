import { Router } from "express";
import { signup, login, refresh, logout } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { z } from "zod";

const router = Router();

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const tokenSchema = z.object({
  refreshToken: z.string().min(1),
});

router.post("/signup", validate({ body: authSchema }), signup);
router.post("/login", validate({ body: authSchema }), login);
router.post("/refresh", validate({ body: tokenSchema }), refresh);
router.post("/logout", validate({ body: tokenSchema }), logout);

export default router;
