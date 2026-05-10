import express from "express";
import authRoutes from "./routes/auth.route.js";
import workoutRoutes from "./routes/workout.route.js";
import exerciseRoutes from "./routes/exercise.route.js";
import measurementRoutes from "./routes/measurement.route.js";
import reportRoutes from "./routes/report.route.js";
import { errorHandler } from "./middlewares/error.js";
import { loggingMiddleware } from "./middlewares/logger.js";

const app = express();

app.use(express.json());
app.use(loggingMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/reports", reportRoutes);

app.use(errorHandler);

export default app;
