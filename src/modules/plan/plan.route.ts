import express from "express";
import {
  createPlanController,
  planDeleteController,
  planUpdateController,
  readManyController,
  readOneController,
} from "./plan.controller.js";
import {
  planUpdateValidateMiddleware,
  planValidateMiddleware,
} from "./validage.middeware.js";
import { planAuthMiddleware } from "./plan.auth.middelware.js";

const route = express.Router();

route.use(planAuthMiddleware);

// -------------------------------------------------------------

route.get("/", readManyController);

route.get("/readone", readOneController);

route.post("/", planValidateMiddleware, createPlanController);

route.put("/update", planUpdateValidateMiddleware, planUpdateController);

route.delete("/delete/:planId", planDeleteController);

// -------------------------------------------------------------

export default route;
