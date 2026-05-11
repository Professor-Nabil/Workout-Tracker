import { prisma } from "./lib/db.js";

// run();
async function run() {
  try {
    const result = await prisma.user.create({
      data: {
        email: "user1@example.com",
        password: "user1_password",
      },
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}
