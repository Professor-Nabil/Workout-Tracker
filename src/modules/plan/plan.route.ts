import express from "express";
import { planController } from "./plan.controller.js";
import { planValidateMiddleware } from "./validage.middeware.js";
import { planAuthMiddleware } from "./plan.auth.middelware.js";

const route = express.Router();

route.post(
  "/create",
  planAuthMiddleware,
  planValidateMiddleware,
  planController,
);

export default route;
