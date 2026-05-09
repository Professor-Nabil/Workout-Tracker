import express from "express";
import authRoutes from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/error.js";
import { loggingMiddleware } from "./middlewares/logger.js";

const app = express();

app.use(express.json());
app.use(loggingMiddleware);

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
