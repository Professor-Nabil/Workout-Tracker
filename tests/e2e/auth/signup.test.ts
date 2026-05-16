import request from "supertest";
import app from "../../../src/app.js";
import { faker } from "@faker-js/faker";

// Regex fallbacks since we don't have Zod's built-in formatters
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

const user = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

describe("API POST /auth/signup", () => {
  it("Happy path", async () => {
    const { status, body } = await request(app).post("/auth/signup").send(user);

    // 1. Validate Status
    expect(status).toBe(201);

    // 2. Validate Top-Level Body Structure & .strict() behavior
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
    expect(Object.keys(body)).has.length(2); // Strict check: only message and data allowed
    expect(body.message).toBeTypeOf("string");
    expect(body.message.length).toBeGreaterThanOrEqual(5);

    // 3. Validate 'data' Object Structure & .strict() behavior
    const data = body.data;
    expect(data).toBeTypeOf("object");
    expect(data).toHaveProperty("user");
    expect(data).toHaveProperty("token");
    expect(Object.keys(data)).has.length(2); // Strict check

    // 4. Validate 'token' format
    expect(data.token).toBeTypeOf("string");
    expect(data.token).toMatch(jwtRegex);

    // 5. Validate 'user' Object Structure & .strict() behavior
    const resUser = data.user;
    expect(resUser).toBeTypeOf("object");
    expect(resUser).toHaveProperty("id");
    expect(resUser).toHaveProperty("email");
    expect(Object.keys(resUser)).has.length(2); // Strict check

    // 6. Validate nested types and formats
    expect(resUser.id).toBeTypeOf("string");
    expect(resUser.id).toMatch(uuidRegex);

    expect(resUser.email).toBeTypeOf("string");
    expect(resUser.email).toMatch(emailRegex);
  });
});
