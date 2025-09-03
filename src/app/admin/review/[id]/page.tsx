import { notFound } from "next/navigation";
import ReviewPageWrapper from "./_components/page-wrapper";
import AdminReviewProvider from "@/contexts/admin-review-provider";
import { db, stepTwoNbmeQuestions } from "@/db";
import { eq } from "drizzle-orm";

async function fetchQuestionById(id: string) {
  const [question] = await db
    .select()
    .from(stepTwoNbmeQuestions)
    .where(eq(stepTwoNbmeQuestions.id, id));
  return question;
}

type ReviewQuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReviewQuestionPage({
  params,
}: ReviewQuestionPageProps) {
  const { id } = await params;
  const question = await fetchQuestionById(id);
  if (!question) return notFound();

  return (
    <AdminReviewProvider question={question}>
      <ReviewPageWrapper />
    </AdminReviewProvider>
  );
}
