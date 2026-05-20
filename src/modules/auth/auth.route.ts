import {
  loginController,
  logoutController,
  refreshController,
  singupController,
} from "./auth.controller.js";
import express from "express";
import { validateMiddleware } from "./validate.meddleware.js";

const route = express.Router();

route.post("/signup", validateMiddleware, singupController);
route.post("/login", validateMiddleware, loginController);
route.post("/refresh", refreshController);
route.post("/logout", logoutController);

export default route;
