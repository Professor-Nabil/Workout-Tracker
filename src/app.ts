import express from "express";

const app = express();

app.use(express.json());

app.use(async (_req, res) => {
  res.json({ message: "Health" });
});

export default app;
