import { apiLogin } from "./helpers/supertest.helper.js";
import { seedRealUser } from "./helpers/seed.fake.users.js";
import z from "zod";

const realUser1 = await seedRealUser();

describe("API '/auth/login'", () => {
  // -------------------------------------------------------------
  it("Should success login", async () => {
    // -------------------------------------------------------------
    const { body } = await apiLogin(realUser1, 200);
    // -------------------------------------------------------------
    // Validate user id
    expect(body.data.user.id).toBe(realUser1.id);
    // -------------------------------------------------------------
    // Validate access token
    expect(z.jwt().safeParse(body.data.accessToken).success).toBe(true);
    // -------------------------------------------------------------
    // Validate refresh token
    expect(z.jwt().safeParse(body.data.refreshToken).success).toBe(true);
  });

  it("Should failed if email or password is wrong", async () => {
    const { email, password } = realUser1;
    await apiLogin({ email, password: "wrongPassword" }, 400);
    await apiLogin({ email: "wringEmail@email.com", password }, 400);
  });

  it("Should failed if email or password is missing", async () => {
    const { email, password } = realUser1;
    await apiLogin({}, 400);
    await apiLogin({ email }, 400);
    await apiLogin({ password }, 400);
  });
});
