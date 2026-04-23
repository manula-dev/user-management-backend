import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

let _prisma;

function getPrisma() {
  if (!_prisma) {
    _prisma = new PrismaClient({
      adapter: new PrismaMariaDb({
        url: process.env.DATABASE_URL,
      }),
    });
  }
  return _prisma;
}

export { getPrisma as prisma };
