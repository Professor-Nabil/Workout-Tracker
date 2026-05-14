// ./src/app.ts
import express from "express";
import authRoute from "./routes/auth.route.js";
import { globalErrorHandler } from "./middlewares/global.error.middleware.js";

const app = express();

app.use(express.json());
app.use("/auth", authRoute);
app.use(globalErrorHandler); // NOTE: Mult be last!

export default app;
