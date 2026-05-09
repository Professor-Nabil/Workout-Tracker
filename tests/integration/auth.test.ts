import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import app from "../../src/app.js";
vi.mock("../../src/services/auth.service.js", () => {
  class AuthService {
    register = vi.fn().mockResolvedValue({ id: "user-123" });
    login = vi.fn().mockResolvedValue({ id: "user-123" });
    generateTokens = vi.fn().mockResolvedValue({ accessToken: "at", refreshToken: "rt" });
    refreshAccessToken = vi.fn().mockResolvedValue({ accessToken: "new-at" });
    revokeRefreshToken = vi.fn().mockResolvedValue(undefined);
  }
  return { AuthService };
});

describe("Auth Routes (Integration)", () => {
  it("POST /api/auth/signup - should create a user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("userId", "user-123");
  });

  it("POST /api/auth/login - should login and return tokens", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ accessToken: "at", refreshToken: "rt" });
  });

  it("POST /api/auth/signup - should fail on invalid input", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "not-an-email", password: "123" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });
});
