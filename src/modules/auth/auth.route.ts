import { singupController } from "./auth.controller.js";
import express from "express";

const route = express.Router();

route.post("/signup", singupController);

export default route;
