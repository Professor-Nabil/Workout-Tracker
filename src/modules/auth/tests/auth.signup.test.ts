import app from "../../../app.js";
import request from "supertest";
import { faker } from "@faker-js/faker";

describe("API '/auth/singup'", () => {
  it("Should create new user", async () => {
    const result = request(app)
      .post("/auth/singup")
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201);
  });
});
