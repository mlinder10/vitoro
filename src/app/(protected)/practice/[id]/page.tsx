import { db, questions } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import QuestionView from "../_components/question-view";

type PracticeQuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PracticeQuestionPageProps({
  params,
}: PracticeQuestionPageProps) {
  const { id } = await params;
  const [question] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id))
    .limit(1);
  if (!question) return notFound();

  return <QuestionView question={question} />;
}
