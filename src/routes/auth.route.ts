import express from "express";
import { signupController } from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/signup", signupController);

export default route;
