import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { execSync } from "child_process";
import "dotenv/config";

export const randomDbName = () => {
  return "auth_db_test_" + Math.random().toString(36).substring(2);
};

const getDbUrl = () => {
  const url = new URL(process.env.DATABASE_URL!);
  return {
    host: url.hostname,
    user: url.username,
    password: url.password,
    protocol: url.protocol,
  };
};

export const createTestDatabase = async (dbName: string) => {
  const { host, user, password, protocol } = getDbUrl();

  execSync(
    `mariadb -h ${host} -u ${user} -p${password} -e "CREATE DATABASE IF NOT EXISTS ${dbName}"`,
  );

  const testDbUrl = `${protocol}//${user}:${password}@${host}/${dbName}`;

  process.env.DATABASE_URL = testDbUrl;
  execSync("npx prisma db push --schema=prisma/schema.prisma");

  const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

  return new PrismaClient({ adapter });
};

export const dropTestDatabase = async (dbName: string) => {
  const { host, user, password } = getDbUrl();
  execSync(
    `mariadb -h ${host} -u ${user} -p${password} -e "DROP DATABASE IF EXISTS ${dbName}"`,
  );
};
