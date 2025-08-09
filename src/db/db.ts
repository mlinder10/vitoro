import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const hasDbEnv = Boolean(process.env.DATABASE_URL);
export const isDbConfigured = hasDbEnv;

let dbInstance: ReturnType<typeof drizzle> | null = null;

if (!hasDbEnv) {
  console.warn(
    "[db] DATABASE_URL is not set. Add it to .env.local to enable database access."
  );
}

try {
  if (hasDbEnv) {
    const turso = createClient({
      url: process.env.DATABASE_URL!,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    dbInstance = drizzle(turso);
  }
} catch (err) {
  console.error("[db] Failed to initialize database client:", err);
}

export const db = (dbInstance ||
  (new Proxy(
    {},
    {
      get() {
        throw new Error(
          "Database not configured. Set DATABASE_URL and DATABASE_AUTH_TOKEN in .env.local"
        );
      },
    }
  ) as unknown)) as ReturnType<typeof drizzle>;
