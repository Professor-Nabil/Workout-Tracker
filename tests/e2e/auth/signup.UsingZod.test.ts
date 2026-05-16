import request from "supertest";
import app from "../../../src/app.js";
import { faker } from "@faker-js/faker";
import z from "zod";

const responseSchema = z.object({
  status: z.literal(201),
  body: z
    .object({
      message: z.string().min(5),
      data: z
        .object({
          user: z
            .object({
              id: z.string().uuid(),
              email: z.string().email(),
            })
            .strict(),
          token: z.string().jwt(),
        })
        .strict(),
    })
    .strict(),
});

const user = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

describe("API POST /auth/signup", () => {
  it("Happy path", async () => {
    const { status, body } = await request(app).post("/auth/signup").send(user);

    const result = responseSchema.safeParse({ status, body });

    if (!result.success) {
      const message = result.error.issues.map((e) => {
        return `${e.path} --> ${e.message}`;
      });
      expect.fail(JSON.stringify(message, null, 2));
    }
    expect(result.success).toBe(true);
  });
});
