"use server";

import { db, prompts } from "@/db";

export async function fetchPrompts(offset: number, limit: number) {
  return await db.select().from(prompts).limit(limit).offset(offset);
}
