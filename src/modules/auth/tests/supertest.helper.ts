import request from "supertest";
import app from "../../../app.js";

export const apiSignup = async (body: object, status: number) => {
  return await request(app).post("/auth/signup").send(body).expect(status);
};
