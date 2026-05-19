/*
 * ### Database Health ###  RefreshToken
 * *** Create RefreshToken ***
 * *** Read RefreshToken *** Check if all data is valid
 * *** Delete old refreshToken *** Check if old refreshToken was deleted
 * *** Create new refreshToken *** Check if old refreshToken not equal new refreshToken
 */

import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import env from "../../src/lib/env.schema.js";
import db from "../../src/lib/db.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import z from "zod";
import { resolve } from "dns";

/*
 * Halpers
 */
const generateRandomEmail = () => faker.internet.email();

const generateRandomPassword = () => faker.internet.password();

const generateToken = (userId: string, expiresIn: number) => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn });
};

const hashTokenHalper = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/*
 * Create Real user
 */
let realUser1;
let notHathToken1: string; // This is just orginal token

try {
  // Setup reandm user
  const email = generateRandomEmail();
  const password = generateRandomPassword();
  const hashPassword = await bcrypt.hash(password, 10);

  // Save user on database
  const result = await db.user.create({
    data: {
      email,
      hashPassword,
    },
  });

  // Store user on global scope of this file
  realUser1 = result;
} catch (err) {
  expect.fail(JSON.stringify(err));
}

describe("### Database Health ###  RefreshToken", () => {
  it("*** Create RefreshToken ***", async () => {
    /*
     * Setup Data
     */
    const token = generateToken(realUser1.id, 1000 * 60 * 60 * 24 * 7);
    const hashToken = hashTokenHalper(token);
    const expirersAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const userId = realUser1.id;

    /*
     * Save hashRefreshToken on database
     */
    const result = await db.refreshToken.create({
      data: {
        hashToken,
        expirersAt,
        userId,
      },
    });

    /*
     * Start testing
     */
    expect(result.hashToken).toBe(hashToken);

    /*
     * Store refreshToken on global scope of this file
     */
    notHathToken1 = token;
  });

  it("*** Read RefreshToken *** Check if all data is valid", async () => {
    /*
     * Setup Data
     */
    const hashToken = hashTokenHalper(notHathToken1);
    /*
     * Read RefreshToken
     */
    const result = await db.refreshToken.findUnique({ where: { hashToken } });
    /*
     * Start testing
     */
    if (result) {
      // Validate refreshToken uuid
      expect(z.uuid().safeParse(result.id).success).toBe(true);
      // Validate user uuid
      expect(result.userId).toBe(realUser1.id);
      // Validate hashToken
      expect(result.hashToken).toBe(hashToken);
      // Validate expirersAt and createdAt
      expect(result.expirersAt.getDate()).toBeGreaterThan(
        result.createdAt.getDate(),
      );
    }
  });

  it("*** Delete Old RefreshToken *** Check if old refreshToken was deleted", async () => {
    /*
     * Setup Data
     */
    const hashToken = hashTokenHalper(notHathToken1);
    /*
     * Delete old refreshToken from database
     */
    await db.refreshToken.delete({ where: { hashToken } });
    /*
     * Make sure the refreshToken was deleted from database
     */
    const findOldToken = await db.refreshToken.findUnique({
      where: { hashToken },
    });
    expect(findOldToken).toBe(null);
  });

  it("*** Create new refreshToken *** Check if old refreshToken not equal new refreshToken", async () => {
    /*
     * Setup Data
     */
    await sleep(1100); // To make sure we have old time and now time
    const refreshToken = generateToken(realUser1.id, 1000 * 60 * 60 * 24 * 7);
    const hashToken = hashTokenHalper(refreshToken);
    const expirersAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const userId = realUser1.id;
    /*
     * Save hashRefreshToken on database
     */
    const result = await db.refreshToken.create({
      data: {
        hashToken,
        expirersAt,
        userId,
      },
    });
    /*
     * Check if old refreshToken not equal new refreshToken
     */
    const oldHashRefreshToken = hashTokenHalper(notHathToken1);
    expect(result.hashToken).not.toBe(oldHashRefreshToken);
  });
});
