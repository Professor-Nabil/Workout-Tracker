import {
  seedRealUser,
  seedRefreshToken,
} from "../../test.helpers/seed.fake.users.js";
import { apiLogout } from "../../test.helpers/supertest.helper.js";

const realUser1 = await seedRealUser();
const realToken1 = await seedRefreshToken(realUser1.id);

describe("API '/auth/logout", () => {
  it("Should success logout", async () => {
    // -------------------------------------------------------------
    const { originalRefreshToken } = realToken1;
    const { body } = await apiLogout(
      { refreshToken: originalRefreshToken },
      204,
    );

    // -------------------------------------------------------------
    expect(body).toStrictEqual({});
  });
});
