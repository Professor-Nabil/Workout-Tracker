import express from "express";
import authRoute from "./modules/auth/auth.route.js";
import planRoute from "./modules/plan/plan.route.js";
import { globalError } from "./errors/global.error.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoute);
app.use("/plan", planRoute);

app.use(globalError);

export default app;
