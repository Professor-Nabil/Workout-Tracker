import express from "express";
import { globalError } from "./errors/global.error.js";

const app = express();

app.use(express.json());

app.use(async (_req, res) => {
  res.json({ message: "Health" });
});

app.use(globalError);

export default app;
