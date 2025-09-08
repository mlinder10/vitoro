import { notFound } from "next/navigation";
import ClientSessionPage from "./_components/client-session-page";
import { reorderQuestions } from "@/lib/utils";
import { getSession as getPracticeSession } from "../actions";

type SessionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const data = await getPracticeSession({ id });
  if (!data) return notFound();
  const { session, questions } = data;

  return (
    <ClientSessionPage
      session={session}
      questions={reorderQuestions(questions, session.questionIds)}
    />
  );
}
