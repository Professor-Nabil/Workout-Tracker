import z from "zod";
import { seedRealUser, seedRefreshToken } from "./helpers/seed.fake.users.js";
import { apiRefresh } from "./helpers/supertest.helper.js";

const realUser1 = await seedRealUser();
const realToken1 = await seedRefreshToken(realUser1.id);

describe("API '/auth/refresh'", () => {
  it("Should success to generate new access and refresh token", async () => {
    const refreshToken = realToken1.originalRefreshToken;

    const { body } = await apiRefresh({ refreshToken }, 200);

    expect(z.jwt().safeParse(body.data.accessToken).success).toBe(true);
    expect(body.data.refreshToken).not.toBe(refreshToken);
  });
});
