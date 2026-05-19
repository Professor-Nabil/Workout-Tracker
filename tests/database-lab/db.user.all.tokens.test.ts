/*
 * ### User And RefreshTokens ### one-to-many relationship
 * *** Create one user ***
 * *** Create many refreshToken for one user *** Can't create 2 tokens at the same time
 * *** Read all refreshToken *** Check all if hashToken is valid
 * *** Delete user *** All refreshToken should be auto delete
 */

import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import env from "../../src/lib/env.schema.js";
import db from "../../src/lib/db.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import z from "zod";

/*
 * Halpers
 */
const generateRandomEmail = () => faker.internet.email();

const generateRandomPassword = () => faker.internet.password();

const generateTokenAndHashToken = (userId: string) => {
  const token = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashToken };
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/*
 * Global real user
 */
import type { User } from "../../src/generated/prisma/client.js";
let realUser1: User;
let notHathToken1: string; // This is just orginal refreshToken
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
      const { hashToken } = generateTokenAndHashToken(userId);
      const expirersAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
      /*
       * Save refreshToken on database
       */
      const result = await db.refreshToken.create({
        data: {
          userId,
          hashToken,
          expirersAt,
        },
      });
      /*
       * Simple Test
       */
      expect(result.hashToken).toBe(hashToken);
      /*
       * Store hashToken on Global scope of this file
       */
      hathTokens1.push(hashToken);
    }
  });

  it("*** Read all refreshToken *** Check all if hashToken is valid", async () => {
    hathTokens1.forEach(async (hashToken) => {
      const result = await db.refreshToken.findUnique({
        where: { hashToken },
      });
      /*
       * Validate all hashTokens
       */
      if (result) {
        expect(result.hashToken).toBe(hashToken);
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
    const result = await db.user.delete({ where: { id } });
    /*
     * Check if All refreshToken should be auto delete
     */
    hathTokens1.forEach(async (hashToken) => {
      const result = await db.refreshToken.findUnique({
        where: { hashToken },
      });
      expect(result).toBe(null);
    });
  });
});
