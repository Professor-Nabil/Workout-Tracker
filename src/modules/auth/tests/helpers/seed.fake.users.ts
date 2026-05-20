import { fakeUser } from "./fake.data.helper.js";
import db from "../../../../lib/db.js";
import bcrypt from "bcrypt";

export const seedRealUser = async () => {
  const { email, password } = fakeUser();

  const hashPassword = await bcrypt.hash(password, 12);

  await db.user.create({ data: { email, hashPassword } });

  return { email, password };
};
