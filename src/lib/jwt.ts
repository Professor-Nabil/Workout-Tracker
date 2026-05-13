import jwt from "jsonwebtoken";
import { env } from "../schemas/env.schema.js";

export const generateToken = (payload: Object) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1d" });
};
