import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const router = Router();
const specPath = path.join(process.cwd(), "dist/openapi.json");

router.use("/", swaggerUi.serve);
router.get("/", (req, res, next) => {
  if (fs.existsSync(specPath)) {
    const document = JSON.parse(fs.readFileSync(specPath, "utf-8"));
    swaggerUi.setup(document)(req, res, next);
  } else {
    res.status(404).send("API Documentation not found. Please run 'npm run generate:docs'");
  }
});

export default router;
