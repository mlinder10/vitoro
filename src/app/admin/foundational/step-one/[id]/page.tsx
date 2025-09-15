import {
  db,
  stepOneFoundationalFollowUps,
  stepOneFoundationalQuestions,
} from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientStepOneFoundationalReviewPage from "./client-page";

async function fetchQuestion(id: string) {
  const [[question], followUps] = await Promise.all([
    db
      .select()
      .from(stepOneFoundationalQuestions)
      .where(eq(stepOneFoundationalQuestions.id, id)),
    db
      .select()
      .from(stepOneFoundationalFollowUps)
      .where(eq(stepOneFoundationalFollowUps.foundationalQuestionId, id)),
  ]);
  if (!question) return notFound();
  return { question, followUps };
}

type StepOneFoundationalReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StepOneFoundationalReviewPage({
  params,
}: StepOneFoundationalReviewPageProps) {
  const { id } = await params;
  const { question, followUps } = await fetchQuestion(id);
  return (
    <ClientStepOneFoundationalReviewPage
      question={question}
      followUps={followUps}
    />
  );
}
