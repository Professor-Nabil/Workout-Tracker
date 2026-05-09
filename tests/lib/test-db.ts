import { PrismaMariaDb } from "@prisma/adapter-mariadb"; // NOTE: This code created by Nabil
import { PrismaClient } from "../../src/generated/client/client.js";
import { execSync } from "child_process";
import { env } from "../../src/lib/env.js";

const getDbCredentials = () => {
  const url = new URL(env.DATABASE_URL);
  return {
    host: url.hostname,
    user: url.username,
    password: url.password,
    protocol: url.protocol,
  };
};

export const createTestDatabase = async (dbName: string) => {
  const { host, user, password, protocol } = getDbCredentials();

  execSync(
    `mariadb -h ${host} -u ${user} -p${password} -e "CREATE DATABASE IF NOT EXISTS ${dbName}"`,
  );

  const testDbUrl = `${protocol}//${user}:${password}@${host}/${dbName}`;

  // Run schema push
  process.env.DATABASE_URL = testDbUrl;
  execSync("npx prisma db push --schema=prisma/schema.prisma");

  const adapter = new PrismaMariaDb(process.env.DATABASE_URL); // NOTE: This code created by Nabil

  return new PrismaClient({ adapter }); // NOTE: This code created by Nabil
};

export const dropTestDatabase = async (dbName: string) => {
  const { host, user, password } = getDbCredentials();
  execSync(
    `mariadb -h ${host} -u ${user} -p${password} -e "DROP DATABASE IF EXISTS ${dbName}"`,
  );
};
