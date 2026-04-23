import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

export const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    url: process.env.DATABASE_URL,
  }),
});
