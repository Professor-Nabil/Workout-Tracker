// ./src/routes/auth.route.ts
import express from "express";
import { signupController } from "../controllers/auth.controller.js";
const authRoute = express.Router();

authRoute.post("/signup", signupController);

export default authRoute;
