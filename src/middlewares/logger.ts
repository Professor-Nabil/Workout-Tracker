import morgan from "morgan";
import logger from "../lib/logger.js";

const stream = {
  write: (message: string) => logger.http(message.trim()),
};

const format = ":method :url :status :response-time ms";

export const loggingMiddleware = morgan(format, { stream });
