import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.route.js";
import workoutRoutes from "./routes/workout.route.js";
import exerciseRoutes from "./routes/exercise.route.js";
import measurementRoutes from "./routes/measurement.route.js";
import reportRoutes from "./routes/report.route.js";
import frontendRoutes from "./routes/frontend.route.js";
import { errorHandler } from "./middlewares/error.js";
import { loggingMiddleware } from "./middlewares/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Set up EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

// Serve static files (CSS, client-side JS)
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.use(express.json());
app.use(loggingMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/reports", reportRoutes);

// Frontend routes
app.use("/", frontendRoutes);

app.use(errorHandler);

export default app;
