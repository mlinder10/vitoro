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
  const result = await fetchQuestionById(id);
  if (!result) return notFound();
  const { question, audit } = result;

  return (
    <AdminReviewProvider question={question} audit={audit}>
      <ReviewPageWrapper />
    </AdminReviewProvider>
  );
}
