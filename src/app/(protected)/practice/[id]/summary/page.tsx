import { notFound } from "next/navigation";
import ClientSummaryPage from "./_components/client-summary-page";
import { reorderQuestions } from "@/lib/utils";
import { getSummary } from "../../actions";

type SessionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SummaryPage({ params }: SessionPageProps) {
  const { id } = await params;
  const data = await getSummary(id);
  if (!data) return notFound();
  const { session, questions } = data;

  return (
    <ClientSummaryPage
      session={session}
      questions={reorderQuestions(questions, session.questionIds)}
    />
  );
}
