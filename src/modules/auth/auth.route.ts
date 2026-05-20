import { loginController, singupController } from "./auth.controller.js";
import express from "express";
import { validateMiddleware } from "./validate.meddleware.js";

const route = express.Router();

route.post("/signup", validateMiddleware, singupController);
route.post("/login", validateMiddleware, loginController);

export default route;
