import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

class Database {
  static connection = drizzle(
    createClient({
      url: process.env.DATABASE_URL!,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    })
  );
}

export const db = Database.connection;
