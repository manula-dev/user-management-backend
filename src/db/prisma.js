import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import pkg from "@prisma/client";
import { env } from "../config/env.js";

const { PrismaClient } = pkg;

let _prisma;

function getAdapterUrl(databaseUrl) {
  if (databaseUrl.startsWith("${{")) {
    throw new Error(
      "DATABASE_URL is unresolved. Set it to a real MySQL/MariaDB connection string before starting the server."
    );
  }

  if (databaseUrl.startsWith("mysql://")) {
    return databaseUrl.replace(/^mysql:\/\//i, "mariadb://");
  }

  if (databaseUrl.startsWith("mariadb://")) {
    return databaseUrl;
  }

  throw new Error(
    "DATABASE_URL must start with mysql:// or mariadb:// for PrismaMariaDb."
  );
}

function getPrisma() {
  if (!_prisma) {
    _prisma = new PrismaClient({
      adapter: new PrismaMariaDb(getAdapterUrl(env.DATABASE_URL)),
    });
  }
  return _prisma;
}

export { getPrisma as prisma };
