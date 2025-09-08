"use server";

import { db, qbankSessions } from "@/db";
import { eq } from "drizzle-orm";

export async function getSessions(userId: string) {
  return await db
    .select()
    .from(qbankSessions)
    .where(eq(qbankSessions.userId, userId));
}

export async function updateSessionName(id: string, name: string) {
  await db.update(qbankSessions).set({ name }).where(eq(qbankSessions.id, id));
}

export async function deleteSession(id: string) {
  await db.delete(qbankSessions).where(eq(qbankSessions.id, id));
}
