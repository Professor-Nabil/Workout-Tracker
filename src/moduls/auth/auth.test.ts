import request from "supertest";
import app from "../../app.js";
import { faker } from "@faker-js/faker";
import z from "zod";

const generateRandomUser = () => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

describe("API /auth/sginup", () => {
  it("Happy path", async () => {
    await request(app)
      .post("/auth/signup")
      .send(generateRandomUser())
      .expect(201)
      .then((res) => {
        const { body } = res;
        const { message, data } = body;
        const { user, token } = data;
        const { id, email } = user;
        expect(z.uuid().safeParse(id).success).toBe(true);
        expect(z.email().safeParse(email).success).toBe(true);
        expect(z.jwt().safeParse(token).success).toBe(true);
        expect(z.string().min(5).safeParse(message).success).toBe(true);
      });
  });

  it("Should failed if email already exists", async () => {
    const user = generateRandomUser();
    await request(app).post("/auth/signup").send(user);
    await request(app).post("/auth/signup").send(user).expect(409);
  });
  it("Should failed if email already exists", async () => {
    const { email, password } = generateRandomUser();
    await request(app).post("/auth/signup").send().expect(400);
    await request(app).post("/auth/signup").send({ email }).expect(400);
    await request(app).post("/auth/signup").send({ password }).expect(400);
    await request(app)
      .post("/auth/signup")
      .send({ email, password, a: "a" })
      .expect(400);
  });
});
