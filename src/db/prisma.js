import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required in .env");
}

const url = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: url.port ? Number(url.port) : 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\/+/, ""),
});

export const prisma = new PrismaClient({ adapter });
