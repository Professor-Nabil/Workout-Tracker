import request from "supertest";
import app from "../../../app.js";
import { faker } from "@faker-js/faker";
import z from "zod";

const generateRandomUser = () => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

describe("API /auth/login", () => {
  it("Happy path", async () => {
    const user = generateRandomUser();
    await request(app).post("/auth/signup").send(user).expect(201);
    await request(app)
      .post("/auth/login")
      .send(user)
      .expect(200)

      .then((res) => {
        const { body } = res;
        const { message, data } = body;
        const { user, token } = data;
        const { id, email } = user;
        expect(z.uuid().safeParse(id).success).toBe(true);
        expect(z.email().safeParse(email).success).toBe(true);
        expect(z.jwt().safeParse(token).success).toBe(true);
        expect(z.string().min(5).safeParse(message).success).toBe(true);
        expect(user).not.toHaveProperty("hashPassword");
        expect(user).not.toHaveProperty("password");
      });
  });

  it("Should failed if email or password is wrong", async () => {
    const user = generateRandomUser();
    const { email, password } = user;
    await request(app).post("/auth/signup").send(user).expect(201);
    await request(app)
      .post("/auth/login")
      .send({ email: "this_is_random_email_4273207392@gmail.com", password })
      .expect(404);
    await request(app)
      .post("/auth/login")
      .send({ email, password: "this_is_random_password_4273207392" })
      .expect(404);
  });

  it("Should failed if email or password is missing", async () => {
    const user = generateRandomUser();
    const { email, password } = user;
    await request(app).post("/auth/signup").send(user).expect(201);

    await request(app).post("/auth/login").send().expect(400);
    await request(app).post("/auth/login").send({ email }).expect(400);
    await request(app).post("/auth/login").send({ password }).expect(400);
    await request(app)
      .post("/auth/signup")
      .send({ email, password, anydata: "anydata" })
      .expect(400);
  });
});
