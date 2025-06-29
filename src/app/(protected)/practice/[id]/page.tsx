import db from "@/db/db";
import { notFound } from "next/navigation";
import QuestionView from "../_components/question-view";
import { parseQuestion } from "@/types";

type PracticeQuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PracticeQuestionPageProps({
  params,
}: PracticeQuestionPageProps) {
  const { id } = await params;
  const question = await db.question.findUnique({ where: { id } });
  if (!question) return notFound();
  const parsed = parseQuestion(question);
  if (!parsed) return notFound();

  return <QuestionView question={parsed} />;
}
