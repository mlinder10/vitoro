import {
  db,
  qbankSessions,
  stepOneNbmeQuestions,
  stepTwoNbmeQuestions,
} from "@/db";
import { eq, inArray, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientSessionPage from "./_components/client-session-page";
import { NBMEStep } from "@/types";

type SessionPageProps = {
  params: Promise<{ id: string }>;
};

async function fetchSession(id: string) {
  const [session] = await db
    .select()
    .from(qbankSessions)
    .where(and(eq(qbankSessions.id, id), eq(qbankSessions.inProgress, true)));
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

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const { session, questions } = await fetchSession(id);

  return <ClientSessionPage session={session} questions={questions} />;
}
