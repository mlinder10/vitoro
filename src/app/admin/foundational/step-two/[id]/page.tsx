import {
  db,
  stepTwoFoundationalFollowUps,
  stepTwoFoundationalQuestions,
} from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientStepTwoFoundationalReviewPage from "./client-page";

async function fetchQuestion(id: string) {
  const [[question], followUps] = await Promise.all([
    db
      .select()
      .from(stepTwoFoundationalQuestions)
      .where(eq(stepTwoFoundationalQuestions.id, id)),
    db
      .select()
      .from(stepTwoFoundationalFollowUps)
      .where(eq(stepTwoFoundationalFollowUps.foundationalQuestionId, id)),
  ]);
  if (!question) return notFound();
  return { question, followUps };
}

type StepTwoFoundationalReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StepTwoFoundationalReviewPage({
  params,
}: StepTwoFoundationalReviewPageProps) {
  const { id } = await params;
  const { question, followUps } = await fetchQuestion(id);
  return (
    <ClientStepTwoFoundationalReviewPage
      question={question}
      followUps={followUps}
    />
  );
}
