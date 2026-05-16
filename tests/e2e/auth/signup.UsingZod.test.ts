import request from "supertest";
import app from "../../../src/app.js";
import { faker } from "@faker-js/faker";
import { sginupResponseSchema } from "../../../src/schemas/response/auth/signup.schema.js";

const user = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

describe("API POST /auth/signup", () => {
  it("Happy path", async () => {
    const { status, body } = await request(app).post("/auth/signup").send(user);

    const result = sginupResponseSchema.safeParse({ status, body });

    if (!result.success) {
      const message = result.error.issues.map((e) => {
        return `${e.path} --> ${e.message}`;
      });
      expect.fail(JSON.stringify(message, null, 2));
    }
    expect(result.success).toBe(true);
  });

  it("Should fail if email already exists", async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await request(app).post("/auth/signup").send(user);
    const { status, body } = await request(app).post("/auth/signup").send(user);

    expect(status).toBe(409);
    expect(body).toHaveProperty("status");
    expect(body.status).toBe("fail");
    expect(body).toHaveProperty("message");
  });
});
