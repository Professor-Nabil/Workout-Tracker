import { describe, it, expect, vi } from "vitest";
import { auth } from "../../../src/middlewares/auth.js";
import { AuthenticationError } from "../../../src/lib/errors.js";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

describe("auth middleware", () => {
  it("should proceed if token is valid", () => {
    const req = { headers: { authorization: "Bearer valid-token" } } as Request;
    const res = {} as Response;
    const next = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(jwt.verify).mockReturnValue({ userId: "user-123" } as any);

    auth(req, res, next);

    expect(req.user).toEqual({ userId: "user-123" });
    expect(next).toHaveBeenCalled();
  });

  it("should throw AuthenticationError if no token provided", () => {
    const req = { headers: {} } as Request;
    const res = {} as Response;
    const next = vi.fn();

    expect(() => auth(req, res, next)).toThrow(AuthenticationError);
  });

  it("should throw AuthenticationError if token is invalid", () => {
    const req = { headers: { authorization: "Bearer invalid-token" } } as Request;
    const res = {} as Response;
    const next = vi.fn();

    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error("Invalid");
    });

    expect(() => auth(req, res, next)).toThrow(AuthenticationError);
  });
});
