import request from "supertest";
import app from "../../app.js";

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

export const apiPlanCreate = async (
  body: object,
  status: number,
  incommingAccessToken: string,
) => {
  return await request(app)
    .post("/plan/create")
    .set(`Authorization`, `Bearer ${incommingAccessToken}`)
    .send(body)
    .expect(status);
};

export const apiPlanReadOne = async (
  body: object,
  status: number,
  incommingAccessToken: string,
) => {
  return await request(app)
    .get("/plan/readone")
    .set(`Authorization`, `Bearer ${incommingAccessToken}`)
    .send(body)
    .expect(status);
};

export const apiPlanReadAll = async (incommingAccessToken: string) => {
  return await request(app)
    .get("/plan/readall")
    .set(`Authorization`, `Bearer ${incommingAccessToken}`);
};
