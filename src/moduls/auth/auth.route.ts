import express from "express";
import { sginupController } from "./auth.controller.js";
import { sginupValidateMiddleware } from "./auth.validat.meddleware.js";

const route = express.Router();

route.post("/signup", sginupValidateMiddleware, sginupController);

export default route;
