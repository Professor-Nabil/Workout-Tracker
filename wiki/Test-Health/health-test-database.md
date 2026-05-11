# Test Database Health: Should create new Database for each test

```ts
// NOTE: this file should be in path ./tests/health-test-database.test.ts
// NOTE: Rename this file to health-test-database.test.ts
import { describe, it, beforeEach, expect, afterEach } from "vitest";
import { createTestDatabase, dropTestDatabase } from "./setup-db.js";

describe("Test Database Health: Should create new Database for each test", () => {
  const user = {
    email: "user@example.com",
    password: "user_password",
  };
  let dbName: string;
  let prisma: any;

  beforeEach(async () => {
    dbName = "auth_db_test_" + Math.random().toString(36).substring(7);
    prisma = await createTestDatabase(dbName);
  });
  afterEach(async () => {
    dropTestDatabase(dbName);
  });

  it("Should create one user in new test_database", async () => {
    const newUser = await prisma.user.create({ data: user });
    const findUsers = await prisma.user.findMany({});
    expect(newUser.email).toBe(user.email);
    expect(findUsers.length).toBe(1);
  });
  it("Should create one user in new test_database", async () => {
    const newUser = await prisma.user.create({ data: user });
    const findUsers = await prisma.user.findMany({});
    expect(newUser.email).toBe(user.email);
    expect(findUsers.length).toBe(1);
  });
});
```
