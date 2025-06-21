import { fetchQuestionById } from "@/db/question";
import { notFound } from "next/navigation";
import ReviewPageWrapper from "./_components/page-wrapper";
import AdminReviewProvider from "@/contexts/admin-review-provider";

type ReviewQuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReviewQuestionPage({
  params,
}: ReviewQuestionPageProps) {
  const { id } = await params;
  const q = await fetchQuestionById(id);
  if (!q) return notFound();
  const { question, audit } = q;

  return (
    <AdminReviewProvider question={question} audit={audit}>
      <ReviewPageWrapper />
    </AdminReviewProvider>
  );
}
