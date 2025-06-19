// import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => new PrismaClient();

declare global {
  var db: ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.db ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.db = db;
}

export default db;
