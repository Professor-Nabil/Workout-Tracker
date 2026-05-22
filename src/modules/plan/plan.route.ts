import express from "express";
import {
  planController,
  readManyController,
  readOneController,
} from "./plan.controller.js";
import { planValidateMiddleware } from "./validage.middeware.js";
import { planAuthMiddleware } from "./plan.auth.middelware.js";

const route = express.Router();

route.post(
  "/create",
  planAuthMiddleware,
  planValidateMiddleware,
  planController,
);

route.get("/readone", planAuthMiddleware, readOneController);

route.get("/readmany", planAuthMiddleware, readManyController);

export default route;
