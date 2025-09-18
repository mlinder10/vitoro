import {
  db,
  stepTwoFoundationalQuestions,
  stepTwoFoundationalFollowUps,
  answeredStepTwoFoundationals,
} from "@/db";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ClientStepTwoFoundationalPage } from "./client-step-two-foundational-page";

async function getQuestion(id: string, userId: string) {
  const [[question], followUps, [answer]] = await Promise.all([
    db
      .select()
      .from(stepTwoFoundationalQuestions)
      .where(eq(stepTwoFoundationalQuestions.id, id))
      .limit(1),
    db
      .select()
      .from(stepTwoFoundationalFollowUps)
      .where(eq(stepTwoFoundationalFollowUps.foundationalQuestionId, id)),
    db
      .select()
      .from(answeredStepTwoFoundationals)
      .where(
        and(
          eq(answeredStepTwoFoundationals.foundationalQuestionId, id),
          eq(answeredStepTwoFoundationals.userId, userId)
        )
      )
      .limit(1),
  ]);
  if (!question) return notFound();
  return { question, followUps, answer: answer ?? null };
}

type StepTwoFoundationalPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StepTwoFoundationalPage({
  params,
}: StepTwoFoundationalPageProps) {
  const [{ id }, { id: userId }] = await Promise.all([params, getSession()]);
  const { question, followUps, answer } = await getQuestion(id, userId);
  return (
    <ClientStepTwoFoundationalPage
      userId={userId}
      question={question}
      followUps={followUps}
      answer={answer}
    />
  );
}
