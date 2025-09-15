import { db, stepTwoNbmeQuestions } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ClientStepTwoNbmeReviewPage from "./client-page";

async function fetchQuestion(id: string) {
  const [question] = await db
    .select()
    .from(stepTwoNbmeQuestions)
    .where(eq(stepTwoNbmeQuestions.id, id));
  if (!question) return notFound();
  return question;
}

type StepTwoNbmeReviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StepTwoNbmeReviewPage({
  params,
}: StepTwoNbmeReviewPageProps) {
  const { id } = await params;
  const question = await fetchQuestion(id);
  return <ClientStepTwoNbmeReviewPage question={question} />;
}
