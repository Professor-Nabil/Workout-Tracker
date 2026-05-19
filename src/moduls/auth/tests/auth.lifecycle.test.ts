import request from "supertest";
import app from "../../../app.js";
import { faker } from "@faker-js/faker";
import z from "zod";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateRandomUser = () => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

describe("API /auth Token Lifecycle Handling", () => {
  let activeRefreshToken = "";
  let user = generateRandomUser();

  // Setup: Register a user and capture an initial token to test rotation
  beforeAll(async () => {
    const signupRes = await request(app)
      .post("/auth/signup")
      .send(user)
      .expect(201);

    activeRefreshToken = signupRes.body.data.refreshToken;
  });

  describe("POST /auth/refresh - Token Rotation Lifecycle", () => {
    it("Happy Path: Should successfully rotate valid refresh tokens", async () => {
      await wait(1100);
      const res = await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: activeRefreshToken })
        .expect(200);

      const { body } = res;
      expect(z.jwt().safeParse(body.data.refreshToken).success).toBe(true);
      expect(body.data.refreshToken).not.toBe(activeRefreshToken);
      activeRefreshToken = body.data.refreshToken;
    });

    it("Security Check: Reusing an old or already rotated token should throw 401", async () => {
      await wait(1000);
      const res = await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: activeRefreshToken })
        .expect(200);

      const deadTokenToken = activeRefreshToken;
      activeRefreshToken = res.body.data.refreshToken;

      // 3. Attack attempt: Try to use deadTokenToken again. It must fail with 401!
      await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: deadTokenToken })
        .expect(401);
    });

    it("Should fail if the refreshToken field is completely omitted", async () => {
      await request(app).post("/auth/refresh").send({}).expect(400);
    });

    it("Should fail if the refresh token formatting is invalid", async () => {
      await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: "completely-malformed-string-token" })
        .expect(401);
    });
  });

  describe("POST /auth/logout - Session Expiration", () => {
    it("Happy Path: Should cleanly terminate token validity on logout", async () => {
      // 1. Log in freshly to establish a clean token to revoke
      await wait(1100);
      const loginRes = await request(app)
        .post("/auth/login")
        .send(user)
        .expect(200);

      const liveToken = loginRes.body.data.refreshToken;

      // 2. Clear out the token via our logout route
      await request(app)
        .post("/auth/logout")
        .send({ refreshToken: liveToken })
        .expect(200);

      // 3. Confirm that using this token to get a new session now triggers a 401
      await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: liveToken })
        .expect(401);
    });
  });
});
