import {
  db,
  qbankSessions,
  stepOneNbmeQuestions,
  stepTwoNbmeQuestions,
} from "@/db";
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
  const questions = await fetchQuestions(session.questionIds, session.step);
  return { session, questions };
}

async function fetchQuestions(questionIds: string[], step: NBMEStep) {
  switch (step) {
    case "Step 1":
      return await db
        .select()
        .from(stepOneNbmeQuestions)
        .where(inArray(stepOneNbmeQuestions.id, questionIds));
    case "Step 2":
      return await db
        .select()
        .from(stepTwoNbmeQuestions)
        .where(inArray(stepTwoNbmeQuestions.id, questionIds));
  }
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
