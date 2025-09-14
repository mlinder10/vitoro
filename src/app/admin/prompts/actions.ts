"use server";

import { db, prompts } from "@/db";
import { sql } from "drizzle-orm";

export async function fetchPrompts(offset: number, limit: number) {
  return await db
    .select()
    .from(prompts)
    .orderBy(sql`${prompts.createdAt} DESC`)
    .limit(limit)
    .offset(offset);
}
