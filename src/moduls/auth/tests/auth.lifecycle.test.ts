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

describe("API /auth Token Lifecycle Handling", () => {
  let activeRefreshToken = "";
  let userCredentials = generateRandomUser();

  // Setup: Register a user and capture an initial token to test rotation
  beforeAll(async () => {
    const signupRes = await request(app)
      .post("/auth/signup")
      .send(userCredentials)
      .expect(201);

    activeRefreshToken = signupRes.body.data.refreshToken;
  });

  describe("POST /auth/refresh - Token Rotation Lifecycle", () => {
    it("Happy Path: Should successfully rotate valid refresh tokens", async () => {
      const res = await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: activeRefreshToken })
        .expect(200);

      const { body } = res;
      expect(body.message).toBe("Tokens refreshed successfully");
      expect(z.jwt().safeParse(body.data.accessToken).success).toBe(true);
      expect(z.jwt().safeParse(body.data.refreshToken).success).toBe(true);

      // Save the freshly generated token for the next steps
      activeRefreshToken = body.data.refreshToken;
    });

    it("Security Check: Reusing an old or already rotated token should throw 401", async () => {
      // 1. Capture the token *before* we rotate it
      const deadTokenToken = activeRefreshToken;

      // 2. Rotate it legitimately. This marks deadTokenToken as used/deleted in DB
      const res = await request(app)
        .post("/auth/refresh")
        .send({ refreshToken: deadTokenToken })
        .expect(200);

      // Update active pointer so subsequent tests don't break
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
      const loginRes = await request(app)
        .post("/auth/login")
        .send(userCredentials)
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
