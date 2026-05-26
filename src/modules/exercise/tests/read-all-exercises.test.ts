import request from "supertest";
import app from "../../../app.js";

describe("### API ### GET 'api/exercises'", () => {
  it("Should success read all exercises", async () => {
    const res = await request(app).get("/api/exercises");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("exercises");
  });
});
