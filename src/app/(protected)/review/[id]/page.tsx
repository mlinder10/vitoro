import PageContent from "./_components/page-content";
import { notFound } from "next/navigation";
import { getQuestion } from "../actions";
import { getSession } from "@/lib/auth";

type ReviewQuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReviewQuestionPage({
  params,
}: ReviewQuestionPageProps) {
  const { id } = await params;
  const { id: userId } = await getSession();
  const question = await getQuestion(id, userId);
  if (!question) return notFound();

  return <PageContent question={question} />;
}
