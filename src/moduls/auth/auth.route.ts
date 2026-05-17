import express from "express";
import { loginController, sginupController } from "./auth.controller.js";
import { sginupValidateMiddleware } from "./auth.validat.meddleware.js";

const route = express.Router();

route.post("/signup", sginupValidateMiddleware, sginupController);
route.post("/login", sginupValidateMiddleware, loginController);

export default route;
