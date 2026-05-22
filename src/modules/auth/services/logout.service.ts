import db from "../../../lib/db.js";
import { hashTokenHelper } from "./helpers/generateTokens.js";

export const logoutService = async (incommingRefreshToken: string) => {
  const hashIncommingRefreshToken = hashTokenHelper(incommingRefreshToken);

  await db.refreshToken.deleteMany({
    where: { hashRefreshToken: hashIncommingRefreshToken },
  });
};
