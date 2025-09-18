import {
  answeredStepOneFoundationals,
  db,
  stepOneFoundationalFollowUps,
  stepOneFoundationalQuestions,
} from "@/db";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ClientStepOneFoundationalPage } from "./client-step-one-foundational-page";
import { getSession } from "@/lib/auth";

async function getQuestion(id: string, userId: string) {
  const [[question], followUps, [answer]] = await Promise.all([
    db
      .select()
      .from(stepOneFoundationalQuestions)
      .where(eq(stepOneFoundationalQuestions.id, id))
      .limit(1),
    db
      .select()
      .from(stepOneFoundationalFollowUps)
      .where(eq(stepOneFoundationalFollowUps.foundationalQuestionId, id)),
    db
      .select()
      .from(answeredStepOneFoundationals)
      .where(
        and(
          eq(answeredStepOneFoundationals.foundationalQuestionId, id),
          eq(answeredStepOneFoundationals.userId, userId)
        )
      )
      .limit(1),
  ]);
  if (!question) return notFound();
  return { question, followUps, answer: answer ?? null };
}

type StepOneFoundationalPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StepOneFoundationalPage({
  params,
}: StepOneFoundationalPageProps) {
  const [{ id }, { id: userId }] = await Promise.all([params, getSession()]);
  const { question, followUps, answer } = await getQuestion(id, userId);
  return (
    <ClientStepOneFoundationalPage
      userId={userId}
      question={question}
      followUps={followUps}
      answer={answer}
    />
  );
}
