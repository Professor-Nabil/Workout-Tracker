// TEST: This file just for testing
import { prisma } from "../lib/db.js";
import jwt from "jsonwebtoken";
import { env } from "../lib/env.js";
import crypto from "crypto";

// fix();
async function fix() {
  try {
    let user = await prisma.user.findUnique({
      where: { email: "nabil@gmail.com" },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "nabil@gmail.com",
          password: "password123",
        },
      });
    }

    const userId = user.id;
    const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    // console.log(refreshToken.length); // 192
    // console.log(hashedToken.length); // 64
    const result = await prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}
