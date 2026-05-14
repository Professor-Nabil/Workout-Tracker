// ./tests/e2e/auth/signup.test.ts
import request from "supertest";
import app from "../../../src/app.js";
import { faker } from "@faker-js/faker";

describe("Test API POST /auth", () => {
  it("Happy Path", async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const result = await request(app).post("/auth/signup").send(user);

    expect(result.status).toBe(201);
    expect(result.body.message).toBeDefined();
    expect(result.body.data).toBeDefined();
    expect(result.body.data.user).toBeDefined();
    expect(result.body.data.user.email).toBeDefined();
    expect(result.body.data.user.email).toBe(user.email);
    expect(result.body.data.user.password).toBeUndefined();
    expect(result.body.data.user.id).toBeDefined();
    expect(result.body.data.user.createdAt).toBeDefined();
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token.length).toBeGreaterThan(150);
  });

  it("Should return 409 if user already exists", async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await request(app).post("/auth/signup").send(user);
    const result = await request(app).post("/auth/signup").send(user);

    expect(result.status).toBe(409);
  });
  it("Should return 400 if email or password is missing", async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const empty = await request(app).post("/auth/signup").send({});
    const missingEmail = await request(app)
      .post("/auth/signup")
      .send({ email: user.email });
    const missingPassword = await request(app)
      .post("/auth/signup")
      .send({ password: user.password });

    expect(empty.status).toBe(400);
    expect(missingEmail.status).toBe(400);
    expect(missingPassword.status).toBe(400);
  });
});
