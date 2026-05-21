import { apiSignup } from "../../test.helpers/supertest.helper.js";
import { fakeUser } from "../../test.helpers/fake.data.helper.js";

describe("API '/auth/singup'", () => {
  // -------------------------------------------------------------
  it("Should create new user", async () => {
    const { body } = await apiSignup(fakeUser(), 201);
    expect(body.data.user).toHaveProperty("id");
  });

  // -------------------------------------------------------------
  it("Should failed if user already exists", async () => {
    const user = fakeUser();

    await apiSignup(user, 201);

    const { body } = await apiSignup(user, 409);
    expect(body.status).toBe("fail");
  });

  // -------------------------------------------------------------
  it("Should failed if email or password is missing", async () => {
    const { email, password } = fakeUser();

    await apiSignup({}, 400);
    await apiSignup({ email }, 400);
    await apiSignup({ password }, 400);
  });
});
