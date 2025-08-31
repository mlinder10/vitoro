import { db, qbankSessions, questions } from "@/db";
import { eq, and, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientSummaryPage from "./_components/client-summary-page";

async function fetchSession(id: string) {
  const [session] = await db
    .select()
    .from(qbankSessions)
    .where(and(eq(qbankSessions.id, id), eq(qbankSessions.inProgress, false)));
  if (!session) return notFound();
  const qs = await db
    .select()
    .from(questions)
    .where(inArray(questions.id, session.questionIds));
  return { session, questions: qs };
}

type SessionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SummaryPage({ params }: SessionPageProps) {
  const { id } = await params;
  const { session, questions } = await fetchSession(id);

  return <ClientSummaryPage session={session} questions={questions} />;
}
