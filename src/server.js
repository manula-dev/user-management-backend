import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./db/prisma.js";

let server;

async function shutdown(signal) {
  console.log(`${signal} received, shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      await prisma.$disconnect().catch((error) => {
        console.error("Error disconnecting Prisma:", error);
      });
      process.exit(0);
    });

    setTimeout(() => {
      process.exit(1);
    }, 10000).unref();
    return;
  }

  await prisma.$disconnect().catch(() => {});
  process.exit(0);
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

async function start() {
  await prisma.$connect();

  server = app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
