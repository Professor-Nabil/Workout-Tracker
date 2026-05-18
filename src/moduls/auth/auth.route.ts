import express from "express";
import {
  loginController,
  sginupController,
  refreshController,
  logoutController,
} from "./auth.controller.js";
import { sginupValidateMiddleware } from "./auth.validat.meddleware.js";

const route = express.Router();

route.post("/signup", sginupValidateMiddleware, sginupController);
route.post("/login", sginupValidateMiddleware, loginController);

// New endpoints for Token Lifecycle Management
route.post("/refresh", refreshController);
route.post("/logout", logoutController);

export default route;
