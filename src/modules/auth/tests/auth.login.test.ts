import { apiLogin } from "./helpers/supertest.helper.js";
import { fakeUser } from "./helpers/fake.data.helper.js";
import { seedRealUser } from "./helpers/seed.fake.users.js";

const realUser1 = await seedRealUser();

describe("API '/auth/login'", () => {
  // -------------------------------------------------------------
  it("Should create new user", async () => {
    const { body } = await apiLogin(realUser1, 200);
    // expect(body.data.user).toHaveProperty("id")
  });
});
