import express from "express";
import authRoute from "./modules/auth/auth.route.js";
import planRoute from "./modules/plan/plan.route.js";
import { globalError } from "./errors/global.error.js";

const app = express();

app.use(express.json());

app.use(express.static("public"));

app.use("/api/auth", authRoute);
app.use("/api/plans", planRoute);

app.use(globalError);

export default app;
