# Test Database Health: Mock Prisma Client

```ts
// NOTE: this file should be in path ./tests/health-mock-prisma-client.test.ts
// NOTE: Rename this file to health-mock-prisma-client.test.ts
import { describe, it, beforeAll, afterAll, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { createTestDatabase, dropTestDatabase } from "./setup-db.js";
import * as db from "../src/lib/db.js";

describe("Test Database Health: Mock Prisma Client", () => {
  const user = {
    email: "user1@example.com",
    password: "user1_password",
  };
  let dbName = "auth_db_test_" + Math.random().toString(36).substring(7);
  let testPrisma: any;

  beforeAll(async () => {
    testPrisma = await createTestDatabase(dbName);
    vi.spyOn(db, "prisma", "get").mockReturnValue(testPrisma);
  });

  afterAll(async () => {
    dropTestDatabase(dbName);
  });

  beforeEach(async () => {
    await testPrisma.user.deleteMany({});
  });

  it("Should delete and create new user", async () => {
    await request(app).post("/api/v1/auth").send(user).expect(201, user);
  });

  it("Happy Path:", async () => {
    await request(app).post("/api/v1/auth").send(user).expect(201, user);
  });
});
```
