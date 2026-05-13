import request from "supertest";
import app from "../../../src/app.js";
import { faker } from "@faker-js/faker";

describe("Test API POST /auth", () => {
  it("Hapy Path", async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const result = await request(app).post("/auth/signup").send(user);

    expect(result.status).toBe(201);
    expect(result.body.message).toBeDefined();
    expect(result.body.data).toBeDefined();
    expect(result.body.data.user).toBeDefined();
    expect(result.body.data.user.id).toBeDefined();
    expect(result.body.data.user.createdAt).toBeDefined();
    expect(result.body.data.token).toBeDefined();
  });
});
