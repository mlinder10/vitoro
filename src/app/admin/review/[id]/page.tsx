import { fetchQuestionById } from "@/db/question";
import { notFound } from "next/navigation";
import ReviewPageWrapper from "./_components/page-wrapper";

type ReviewQuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// TODO: add information about question creator
export default async function ReviewQuestionPage({
  params,
}: ReviewQuestionPageProps) {
  const { id } = await params;
  const q = await fetchQuestionById(id);
  if (!q) return notFound();
  const { question, audit } = q;

  return <ReviewPageWrapper question={question} audit={audit} />;
}
