import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument } from "../lib/swagger.js";

const router = Router();
const document = generateOpenApiDocument();

router.use("/", swaggerUi.serve, swaggerUi.setup(document));

export default router;
