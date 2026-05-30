import request from "supertest";
import app from "../../app.js";

export const apiSignup = async (body: object, status: number) => {
  return await request(app).post("/api/auth/signup").send(body).expect(status);
};

export const apiLogin = async (body: object, status: number) => {
  return await request(app).post("/api/auth/login").send(body).expect(status);
};

export const apiRefresh = async (body: object, status: number) => {
  return await request(app).post("/api/auth/refresh").send(body).expect(status);
};

export const apiLogout = async (body: object, status: number) => {
  return await request(app).post("/api/auth/logout").send(body).expect(status);
};

export const apiPlanCreate = async (
  body: object,
  status: number,
  incommingAccessToken: string,
) => {
  return await request(app)
    .post("/api/plans")
    .set(`Authorization`, `Bearer ${incommingAccessToken}`)
    .send(body)
    .expect(status);
};

export const apiPlanReadOne = async (
  planId: string,
  status: number,
  incommingAccessToken: string,
) => {
  return await request(app)
    .get(`/api/plans/${planId}`)
    .set(`Authorization`, `Bearer ${incommingAccessToken}`)
    .expect(status);
};

export const apiPlanReadmany = async (incommingAccessToken: string) => {
  return await request(app)
    .get("/api/plans")
    .set(`Authorization`, `Bearer ${incommingAccessToken}`);
};

export const apiPlanUpdate = async (
  planId: string,
  body: object,
  status: number,
  incommingAccessToken: string,
) => {
  return await request(app)
    .put(`/api/plans/${planId}`)
    .set(`Authorization`, `Bearer ${incommingAccessToken}`)
    .send(body)
    .expect(status);
};

export const apiPlanDelete = async (
  planId: string,
  status: number,
  incommingAccessToken: string,
) => {
  return await request(app)
    .delete(`/api/plans/${planId}`)
    .set(`Authorization`, `Bearer ${incommingAccessToken}`)
    .expect(status);
};
