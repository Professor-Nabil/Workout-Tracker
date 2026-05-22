import express from "express";
import { planController } from "./plan.controller.js";
import { planValidateMiddleware } from "./validage.middeware.js";

const route = express.Router();

route.post("/create", planValidateMiddleware, planController);

export default route;
