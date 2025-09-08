import { getDb, reviewQuestions } from "@/db";
import PageContent from "./_components/page-content";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type ReviewQuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReviewQuestionPage({
    params,
  }: ReviewQuestionPageProps) {
    const { id } = await params;
    const db = await getDb();
    const [question] = await db
      .select()
      .from(reviewQuestions)
      .where(eq(reviewQuestions.id, id));
  if (!question) return notFound();

  return <PageContent question={question} />;
}
