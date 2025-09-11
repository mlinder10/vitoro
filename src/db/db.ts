import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import path from "path";

// Use local SQLite for development, Turso for production
const isDevelopment = process.env.NODE_ENV === "development" || !process.env.DATABASE_URL;

let client;

if (isDevelopment) {
  // Local SQLite database for development
  const dbPath = path.join(process.cwd(), "dev.db");
  client = createClient({
    url: `file:${dbPath}`,
  });
} else {
  // Turso database for production
  client = createClient({
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
}

export const db = drizzle(client);
