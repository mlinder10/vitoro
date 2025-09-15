import { db, stepOneNbmeQuestions } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientStepOneNbmeReviewPage from "./client-page";

async function fetchQuestion(id: string) {
  const [question] = await db
    .select()
    .from(stepOneNbmeQuestions)
    .where(eq(stepOneNbmeQuestions.id, id));
  if (!question) return notFound();
  return question;
}

type StepOneNbmeReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StepOneNbmeReviewPage({
  params,
}: StepOneNbmeReviewPageProps) {
  const { id } = await params;
  const question = await fetchQuestion(id);
  return <ClientStepOneNbmeReviewPage question={question} />;
}
