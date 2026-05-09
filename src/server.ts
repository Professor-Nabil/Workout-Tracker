import app from "./app.js";
import { env } from "./lib/env.js";
import logger from "./lib/logger.js";

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
