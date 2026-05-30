import express from "express";
import {
  createPlanController,
  deletePlanController,
  updatePlanController,
  readManyController,
  readOneController,
} from "./plan.controller.js";
import {
  planUpdateValidateMiddleware,
  planValidateMiddleware,
} from "./validate.middleware.js";
import { planAuthMiddleware } from "./plan.auth.middleware.js";

const route = express.Router();

// Protect all workout plan endpoints with your authentication guard
route.use(planAuthMiddleware);

// 1. CREATE a brand new plan
route.post("/", planValidateMiddleware, createPlanController);

// 2. READ ALL plans belonging to the authenticated user
route.get("/", readManyController);

// 3. READ ONE specific plan by its ID
route.get("/:planId", readOneController);

// 4. UPDATE a specific plan completely by its ID
route.put("/:planId", planUpdateValidateMiddleware, updatePlanController);

// 5. DELETE a specific plan by its ID
route.delete("/:planId", deletePlanController);

// -------------------------------------------------------------

export default route;
