import { db, qbankSessions, nbmeQuestions } from "@/db";
import type { Question } from "@/types";
import { eq, inArray, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientSessionPage from "./_components/client-session-page";

type SessionPageProps = {
  params: Promise<{ id: string }>;
};

async function fetchSession(id: string) {
  const [session] = await db
    .select()
    .from(qbankSessions)
    .where(and(eq(qbankSessions.id, id), eq(qbankSessions.inProgress, true)));
  if (!session) return notFound();
  const qs = await db
    .select()
    .from(nbmeQuestions)
    .where(inArray(nbmeQuestions.id, session.questionIds));
  return { session, questions: qs as unknown as Question[] };
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const { session, questions } = await fetchSession(id);

  return <ClientSessionPage session={session} questions={questions} />;
}
