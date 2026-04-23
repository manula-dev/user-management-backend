import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import pkg from "@prisma/client";
import { env } from "../config/env.js";

const { PrismaClient } = pkg;

const adapter = new PrismaMariaDb(env.DATABASE_URL);

export const prisma = new PrismaClient({ adapter });
