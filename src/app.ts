import { globalErrorMiddleware } from "./middlewares/global.error.js";
import authRoute from "./routes/auth.route.js";
import express from "express";

const app = express();

app.use(express.json());
app.use("/auth", authRoute);
app.use(globalErrorMiddleware);

export default app;
