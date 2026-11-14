import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import app from "./app.js";

const server = app.listen(env.port, () => {
  console.log(`Libra API listening on http://localhost:${env.port}`);
  console.log(`Swagger docs: http://localhost:${env.port}/api/docs`);
});

async function shutdown(signal) {
  console.log(`${signal} received. Closing server...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
