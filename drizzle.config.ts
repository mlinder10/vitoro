import { config } from "dotenv";
config();
import type { Config } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const dialect = url.startsWith("file:") ? "sqlite" : "turso";

export default {
  schema: ["src/db/schemas.ts"],
  out: "./migrations-dev",
  dialect,
  dbCredentials: {
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
