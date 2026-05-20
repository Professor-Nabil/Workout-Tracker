import request from "supertest";
import app from "../../../../app.js";

export const apiSignup = async (body: object, status: number) => {
  return await request(app).post("/auth/signup").send(body).expect(status);
};

export const apiLogin = async (body: object, status: number) => {
  return await request(app).post("/auth/login").send(body).expect(status);
};

export const apiRefresh = async (body: object, status: number) => {
  return await request(app).post("/auth/refresh").send(body).expect(status);
};

export const apiLogout = async (body: object, status: number) => {
  return await request(app).post("/auth/logout").send(body).expect(status);
};
