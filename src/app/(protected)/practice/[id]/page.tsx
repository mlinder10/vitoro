import { answeredQuestions, db, questions } from "@/db";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import QuestionView from "../_components/question-view";
import { getSession } from "@/lib/auth";

type PracticeQuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PracticeQuestionPageProps({
  params,
}: PracticeQuestionPageProps) {
  const { id } = await params;
  const session = await getSession();
  const [question] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id))
    .limit(1);
  if (!question) return notFound();
  const answer = await db
    .select()
    .from(answeredQuestions)
    .where(
      and(
        eq(answeredQuestions.questionId, id),
        eq(answeredQuestions.userId, session.id)
      )
    );
  if (answer.length > 0) redirect("/practice");

  return <QuestionView question={question} />;
}
