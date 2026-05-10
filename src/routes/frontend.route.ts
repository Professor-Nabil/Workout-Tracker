import { Router } from "express";

const router = Router();

// Route to render the home page
router.get("/", (req, res) => {
  // Renders frontend/views/index.ejs
  res.render("index");
});

export default router;
