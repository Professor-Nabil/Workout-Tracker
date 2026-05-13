# File Structure

```bash
.
├── .git/
├── .gitignore
│
├── .env
├── .env.example
│
├── package.json
│
├── tsconfig.json
├── .prettierrc    # Code formatting
├── .eslintrc.json # Linting for TS
│
├── vitest.config.ts
│
├── prisma.config.ts
├── prisma/
│   ├── seed.ts           # For test/dev data
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   │
│   ├── server.ts                      # Entry Point
│   │
│   ├── app.ts                         # Express app setup
│   │
│   ├── routes/                        # API Routes
│   │   └── auth.route.ts
│   │
│   ├── middlewares/                   # Auth & Error Handling
│   │   ├── auth.middleware.ts
│   │   └── global.error.middleware.ts # Global Error Handler
│   │
│   ├── controllers/                   # Request/Response Logic
│   │   └── auth.controller.ts
│   │
│   ├── schemas/                        # Zod Schemas
│   │   └── env.schema.ts
│   │
│   ├── lib/
│   │   ├── db.ts                      # DB Connection
│   │   ├── catch.async.error.ts              # To catch Async Errors
│   │   └── app.error.ts                # Custom Errors (AppError, ConflictError, etc..)
│   │
│   ├── types/                         # Custom TS Types/Interfaces
│   │
│   ├── services/                      # Business Logic & DB Queries
│   │   └── auth.service.ts
│   │
│   ├── constants/                     # For config constants
│   │
│   └── generated/prisma/              # Generated Prisma Client
│
├── tests/
│   ├── e2e/
│   ├── integration/
│   └── unit/
│
└── wiki/
```
