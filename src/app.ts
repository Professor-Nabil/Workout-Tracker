import express from "express";
import authRoute from "./moduls/auth/auth.route.js";
import globalError from "./errors/global.error.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoute);

app.use(globalError);

export default app;
