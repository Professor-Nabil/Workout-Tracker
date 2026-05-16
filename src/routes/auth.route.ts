import express from "express";
import { signupController } from "../controllers/auth.controller.js";
import { validateSignupMiddleware } from "../middlewares/validate.signup.middleware.js";

const route = express.Router();

route.post("/signup", validateSignupMiddleware, signupController);

export default route;
