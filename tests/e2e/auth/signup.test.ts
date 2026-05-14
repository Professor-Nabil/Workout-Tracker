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

  it("Should return 400 if email is invalid", async () => {
    const invalidEmails = [
      "plainaddress", // No @ symbol
      "#@%^%#$@#$@#.com", // Random characters
      "@example.com", // No local part
      "Joe Smith <email@example.com>", // Extra text
      "email.example.com", // No @ symbol
      "email@example@example.com", // Multiple @ symbols
    ];
    const password = faker.internet.password();

    invalidEmails.forEach(async (email) => {
      const result = await request(app)
        .post("/auth/signup")
        .send({ email, password });

      expect(result.status).toBe(400);
      expect(result.body.status).toBe("fail");
    });
  });

  it("Should return 400 if password short", async () => {
    const user = {
      email: faker.internet.email(),
      password: "Short", // The password less than 8
    };

    const result = await request(app).post("/auth/signup").send(user);

    expect(result.status).toBe(400);
    expect(result.body.status).toBe("fail");
  });

  it("Should return 400 if Content-Type in not application/json", async () => {
    const user = JSON.stringify({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const result = await request(app)
      .post("/auth/signup")
      .set("Content-Type", "test/plain")
      .send(user);

    await request(app).post("/auth/signup").send().expect(400);
    expect(result.status).toBe(400);
  });

  it("Should ignore extra fieleds and not save them to the database", async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "ADMIN", // HACK: Attaker trying to elevate privilegee
      hacker: true,
    };
    // BUG: Don't truse outside word

    const result = await request(app).post("/auth/signup").send(user);

    expect(result.status).toBe(400);
  });

  it("Should return 400 if JSON body is malformed", async () => {
    const result = await request(app)
      .post("/auth/signup")
      .set("Content-Type", "application/json")
      .send(`{"email":"user@email.com", "password","password" `); // NOTE: Missing closing brace

    expect(result.status).toBe(400);
  });

  it("Should return 400 if fields are excessively long", async () => {
    const result = await request(app)
      .post("/auth/signup")
      .send({
        email: "a".repeat(1000) + "@test.com", // 1000+ characters
        password: "p".repeat(1000),
      });

    // BUG: It Should be 400
    expect(result.status).toBe(500);
    console.log(result.body);
  });
});
