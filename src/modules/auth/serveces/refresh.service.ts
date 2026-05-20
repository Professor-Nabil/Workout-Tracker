import { AppError } from "../../../errors/app.error.js";
import jwt from "jsonwebtoken";
import env from "../../../lib/env.schema.js";
import db from "../../../lib/db.js";
import { generateTokens, hashTokenHelper } from "./helpers/generateTokens.js";

const refreshSecret = env.JWT_REFRESH_SECRET;

export const refreshService = async (incommingRefreshToken: string) => {
  try {
    // -------------------------------------------------------------
    // Check if incommingHashRefreshToken is valid
    const uncoded = jwt.verify(incommingRefreshToken, refreshSecret);

    if (!uncoded || typeof uncoded === "string") {
      throw new AppError("unAuth1", 401);
    }

    // -------------------------------------------------------------
    // Check if incommingRefreshToken in our database
    const incommingHashRefreshToken = hashTokenHelper(incommingRefreshToken);

    const result = await db.refreshToken.findUnique({
      where: { hashRefreshToken: incommingHashRefreshToken },
    });

    if (!result) {
      throw new AppError("unAuth2", 401);
    }

    // =============================================================
    // NOTE: Now we can auth the user ==============================

    // -------------------------------------------------------------
    // Delete old hashRefreshToken from database
    await db.refreshToken.delete({
      where: { hashRefreshToken: incommingHashRefreshToken },
    });

    // -------------------------------------------------------------
    // Generate tokens
    const { accessToken, refreshToken, hashRefreshToken, expiresAt } =
      await generateTokens(uncoded.id);

    // -------------------------------------------------------------
    // Save hashRefreshToken on database
    await db.refreshToken.create({
      data: {
        userId: uncoded.id,
        hashRefreshToken,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
    // -------------------------------------------------------------
  } catch (err) {
    throw new AppError("unAuth3", 401);
  }
};
