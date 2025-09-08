import { getDb, qbankSessions } from "@/db";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import ClientHistoryPage from "./client-history-page";

async function fetchSessions(userId: string) {
  const db = await getDb();
  return await db
    .select()
    .from(qbankSessions)
    .where(eq(qbankSessions.userId, userId));
}

export default async function HistoryPage() {
  const { id } = await getSession();
  const sessions = await fetchSessions(id);
  return <ClientHistoryPage sessions={sessions} />;
}
