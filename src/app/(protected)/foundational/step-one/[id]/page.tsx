import {
  db,
  stepOneFoundationalFollowUps,
  stepOneFoundationalQuestions,
} from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ClientStepOneFoundationalPage } from "./client-step-one-foundational-page";

async function getQuestion(id: string) {
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

type StepOneFoundationalPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StepOneFoundationalPage({
  params,
}: StepOneFoundationalPageProps) {
  const { id } = await params;
  const { question, followUps } = await getQuestion(id);
  return (
    <ClientStepOneFoundationalPage question={question} followUps={followUps} />
  );
}
