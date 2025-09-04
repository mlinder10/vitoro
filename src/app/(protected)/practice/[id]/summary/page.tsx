import { db, qbankSessions, nbmeQuestions } from "@/db";
import type { Question } from "@/types";
import { eq, and, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientSummaryPage from "./_components/client-summary-page";
import { NBMEStep } from "@/types";

async function fetchSession(id: string) {
  const [session] = await db
    .select()
    .from(qbankSessions)
    .where(and(eq(qbankSessions.id, id), eq(qbankSessions.inProgress, false)));
  if (!session) return notFound();
  const qs = await db
    .select()
    .from(nbmeQuestions)
    .where(inArray(nbmeQuestions.id, session.questionIds));
  const questions: Question[] = qs.map((q) => ({
    ...q,
    system: q.systems[0] ?? "",
  })) as unknown as Question[];
  return { session, questions };
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
