# Logging Strategy

This document outlines the logging infrastructure for the application. We use `winston` for robust, multi-transport logging.

## Core Strategy

- **Library**: `winston`
- **Transport**: Console for local development, File-based or Cloud logging (e.g., Loki/CloudWatch) for production.
- **Log Levels**: Standard RFC5424 levels: `error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly`.

## Implementation

1. **Configuration**: Define `src/lib/logger.ts` to instantiate and export a configured Winston logger.
2. **Format**: JSON format for structured logs, essential for searchability in production.
3. **HTTP Logging**: Integrate `morgan` (middleware) with `winston` to log incoming API requests.

## Log Patterns

- **Error**: Log full stack traces for `error` events.
- **Audit**: Log sensitive actions (e.g., User Login, Password Change) with user metadata.
- **Request**: Log request method, path, status, and duration.

### Winston Configuration Example

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
```

## Security Considerations

- **PII Redaction**: Middleware must sanitize logs to ensure sensitive information (e.g., raw passwords, full JWTs, PII) is never written to log files.
- **Log Rotation**: Implement log rotation using `winston-daily-rotate-file` in production to manage log file size.
