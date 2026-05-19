/*
 * 1. Create user
 * 2. Read user
 * 3. Update user
 * 4. Delete user
 */
import db from "../../src/lib/db.js"; // Prisma client API
import bcrypt from "bcrypt"; // For hash password
import z from "zod"; // For validate uuid and email and date

/*
 * Helpers
 */
import { faker } from "@faker-js/faker";
const generateRandomEmail = () => faker.internet.email();
const generateRandomPassword = () => faker.internet.password();

/*
 * Mock Users
 */
const mockUser1 = {
  email: generateRandomEmail(),
  password: generateRandomPassword(),
};

describe("Database health", () => {
  it("*** Create user ***", async () => {
    try {
      const hashPassword = await bcrypt.hash(mockUser1.password, 10);
      await db.user.create({
        data: {
          email: mockUser1.email,
          hashPassword,
        },
      });
    } catch (err) {
      expect.fail(`Can't create user with email ${mockUser1.email}`);
    }
  });

  it("*** Read user *** check if all data is valid", async () => {
    try {
      // -------------------------------------------------------------
      // Read all user data
      const result = await db.user.findUnique({
        where: { email: mockUser1.email },
        select: {
          id: true,
          email: true,
          hashPassword: true,
          createdAt: true,
          updatedAt: true,
          refreshToken: true,
        },
      });
      // -------------------------------------------------------------
      // The rusult should be not null
      if (result) {
        // -------------------------------------------------------------
        // Validate uuid
        expect(z.uuid().safeParse(result.id).success).toBe(true);
        // -------------------------------------------------------------
        // Validate email
        expect(result.email).toBe(mockUser1.email);
        expect(z.email().safeParse(result.email).success).toBe(true);
        // -------------------------------------------------------------
        // Validate hashPassword
        const isValidPassword = await bcrypt.compare(
          mockUser1.password,
          result.hashPassword,
        );
        expect(isValidPassword).toBe(true);
        // -------------------------------------------------------------
        expect(z.date().safeParse(result.createdAt).success).toBe(true);
        expect(z.date().safeParse(result.updatedAt).success).toBe(true);
        expect(result.createdAt).toStrictEqual(result.updatedAt);
        // -------------------------------------------------------------
        expect(result.refreshToken).toStrictEqual([]);
        // -------------------------------------------------------------
      } else {
        // -------------------------------------------------------------
        expect.fail(`User not found with email ${mockUser1.email}`);
        // -------------------------------------------------------------
      }
    } catch (err) {
      expect.fail(`Unknown Errr: we are trying read user from database`);
    }
  });

  it("*** Update user *** check email and updatedAt", async () => {
    try {
      // -------------------------------------------------------------
      // Update user email
      const result = await db.user.update({
        where: { email: mockUser1.email },
        data: { email: generateRandomEmail() },
      });
      // -------------------------------------------------------------
      // The new email should be not equel old email
      expect(result.email).not.toBe(mockUser1.email);
      // -------------------------------------------------------------
      // The updatedAt should be not equel createdAt
      expect(result.updatedAt).not.toBe(result.createdAt);
      // -------------------------------------------------------------
      // Update mockUser1 email
      mockUser1.email = result.email;
      // -------------------------------------------------------------
    } catch (err) {
      expect.fail(`Can't update user with email ${mockUser1.email}`);
    }
  });

  it("*** Delete user *** check if user deleted", async () => {
    try {
      // -------------------------------------------------------------
      await db.user.delete({ where: { email: mockUser1.email } });
      // -------------------------------------------------------------
      // The user should be not found
      const result = await db.user.findUnique({
        where: { email: mockUser1.email },
      });
      // -------------------------------------------------------------
      // The resulet should be null
      expect(result).toBe(null);
      // -------------------------------------------------------------
    } catch (err) {
      expect.fail(`Can't delete user with email ${mockUser1.email}`);
    }
  });
});
