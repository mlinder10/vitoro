import { notFound } from "next/navigation";
import ReviewPageWrapper from "./_components/page-wrapper";
import AdminReviewProvider from "@/contexts/admin-review-provider";
import { fetchQuestionById } from "@/app/actions/question";

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
