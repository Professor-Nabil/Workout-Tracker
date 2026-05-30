/*
 * ### User And RefreshTokens ### one-to-many relationship
 * *** Create one user ***
 * *** Create many refreshToken for one user *** Can't create 2 tokens at the same time
 * *** Read all refreshToken *** Check all if hashRefreshToken is valid
 * *** Delete user *** All refreshToken should be auto delete
 */

import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import env from "../../src/lib/env.schema.js";
import db from "../../src/lib/db.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

/*
 * Halpers
 */
const generateRandomEmail = () => faker.internet.email();

const generateRandomPassword = () => faker.internet.password();

const generateTokenAndHashToken = (userId: string) => {
  const token = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  const hashRefreshToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  return { token, hashRefreshToken };
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/*
 * Global real user
 */
import type { User } from "../../src/generated/prisma/client.js";
let realUser1: User;
let hathTokens1: string[] = []; // This is hash refreshToken

describe("### User And RefreshTokens ### one-to-many relationship", () => {
  it("*** Create one user ***", async () => {
    /*
     * Setup user data
     */
    const email = generateRandomEmail();
    const password = generateRandomPassword();
    const hashPassword = await bcrypt.hash(password, 10);
    /*
     * Save user on database
     */
    const result = await db.user.create({ data: { email, hashPassword } });
    /*
     * Simple test
     */
    expect(result.email).toBe(email);
    /*
     * Save on Global scope of this fild
     */
    realUser1 = result;
  });

  it("*** Create many refreshToken for one user *** Can't create 2 tokens at the same time", async () => {
    for (let i = 0; i < 3; i++) {
      await sleep(1100);
      /*
       * Setup user data
       */
      const userId = realUser1.id;
      const { hashRefreshToken } = generateTokenAndHashToken(userId);
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
      /*
       * Save refreshToken on database
       */
      const result = await db.refreshToken.create({
        data: {
          userId,
          hashRefreshToken,
          expiresAt,
        },
      });
      /*
       * Simple Test
       */
      expect(result.hashRefreshToken).toBe(hashRefreshToken);
      /*
       * Store hashRefreshToken on Global scope of this file
       */
      hathTokens1.push(hashRefreshToken);
    }
  });

  it("*** Read all refreshToken *** Check all if hashRefreshToken is valid", async () => {
    hathTokens1.forEach(async (hashRefreshToken) => {
      const result = await db.refreshToken.findUnique({
        where: { hashRefreshToken },
      });
      /*
       * Validate all hashRefreshToken
       */
      if (result) {
        expect(result.hashRefreshToken).toBe(hashRefreshToken);
      }
    });
  });

  it("*** Delete user *** All refreshToken should be auto delete", async () => {
    /*
     * Setup Data
     */
    const { id } = realUser1;
    /*
     * Delete user so all refreshToken should be also deleted
     */
    await db.user.delete({ where: { id } });
    /*
     * Check if All refreshToken should be auto delete
     */
    hathTokens1.forEach(async (hashRefreshToken) => {
      const result = await db.refreshToken.findUnique({
        where: { hashRefreshToken },
      });
      expect(result).toBe(null);
    });
  });
});
