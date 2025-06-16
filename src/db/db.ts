import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error("DATABASE_URL and DATABASE_AUTH_TOKEN must be set");
  }

  const adapter = new PrismaLibSQL({
    url,
    authToken,
  });

  return new PrismaClient({ adapter });
};

declare global {
  var db: ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.db ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}

export default db;
