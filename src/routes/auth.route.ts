// ./src/routes/auth.route.ts
import express from "express";
import { signupController } from "../controllers/auth.controller.js";
import { validateSignup } from "../middlewares/validate.auth.signup.middleware.js";
const authRoute = express.Router();

authRoute.post("/signup", validateSignup, signupController);

export default authRoute;
