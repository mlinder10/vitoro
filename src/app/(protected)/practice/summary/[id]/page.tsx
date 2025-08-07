import { db, qbankSessions, questions } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import QuestionsSummaryWrapper from "./_components/component-wrapper";

type QBankSummaryPageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function QBankSummaryPage({
  params,
}: QBankSummaryPageParams) {
  const { id } = await params;
  const [session] = await db
    .select()
    .from(qbankSessions)
    .where(eq(qbankSessions.id, id));
  if (!session) return notFound();
  const qs = await db
    .select()
    .from(questions)
    .where(inArray(questions.id, session.questionIds));

  return <QuestionsSummaryWrapper session={session} questions={qs} />;
}
