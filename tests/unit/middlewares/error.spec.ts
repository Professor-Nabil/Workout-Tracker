import { describe, it, expect, vi } from "vitest";
import { errorHandler } from "../../../src/middlewares/error.js";
import { AppError } from "../../../src/lib/errors.js";
import type { Request, Response } from "express";

describe("errorHandler middleware", () => {
  it("should handle AppError correctly", () => {
    const err = new AppError("Test operational error", 400);
    const req = { path: "/test" } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn();
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Test operational error",
    });
  });

  it("should handle unexpected errors with a 500 status", () => {
    const err = new Error("Something went wrong");
    const req = { path: "/test" } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;

    const next = vi.fn();
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: "Internal server error",
      }),
    );
  });
});
