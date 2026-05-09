import { describe, it, expect, vi } from "vitest";
import { validate } from "../../../src/middlewares/validate.js";
import { z } from "zod";
import { ValidationError } from "../../../src/lib/errors.js";
import type { Request, Response } from "express";

describe("validate middleware", () => {
  it("should validate and proceed if data is correct", () => {
    const schema = { body: z.object({ name: z.string() }) };
    const req = { body: { name: "test" } } as Request;
    const res = {} as Response;
    const next = vi.fn();

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(ValidationError));
  });

  it("should throw ValidationError if data is invalid", () => {
    const schema = { body: z.object({ name: z.string() }) };
    const req = { body: { name: 123 } } as Request;
    const res = {} as Response;
    const next = vi.fn();

    const middleware = validate(schema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
  });
});
