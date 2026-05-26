import express from "express";
import { readAllExerciseController } from "./exercise.controller.js";

const route = express.Router();

route.get("/", readAllExerciseController);

export default route;
