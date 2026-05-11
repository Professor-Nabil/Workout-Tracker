import { describe, it, beforeAll, afterAll, beforeEach, vi } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import {
  createTestDatabase,
  dropTestDatabase,
  randomDbName,
} from "./setup-db.js";
import * as db from "../src/lib/db.js";

describe("E2E API /api/v1/auth", () => {
  const user = {
    email: "user1@example.com",
    password: "user1_password",
  };
  let dbName = randomDbName();
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

  it("Should return email and status 201", async () => {
    await request(app)
      .post("/api/v1/auth")
      .send(user)
      .expect(201, { email: user.email });
  });

  it("Should return 409", async () => {
    await request(app).post("/api/v1/auth").send(user);
    await request(app).post("/api/v1/auth").send(user).expect(409);
  });
});
