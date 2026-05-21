import express from "express";
import { planController } from "./plan.controller.js";

const route = express.Router();

route.post("/create", planController);

export default route;
