import express from "express";
import {
  planController,
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

route.post("/create", planValidateMiddleware, planController);

route.get("/readone", readOneController);

route.get("/readmany", readManyController);

route.put("/update", planUpdateValidateMiddleware, planUpdateController);

export default route;
