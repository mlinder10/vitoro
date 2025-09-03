"use server";

import { db, stepTwoNbmeQuestions } from "@/db";
import { AuditRating, StepTwoNBMEQuestion } from "@/types";
import { eq } from "drizzle-orm";

export async function handleUpdateAuditStatus(
  questionId: string,
  rating: AuditRating
) {
  await db
    .update(stepTwoNbmeQuestions)
    .set({ rating })
    .where(eq(stepTwoNbmeQuestions.id, questionId));
}

export async function handleSaveQuestionChanges(question: StepTwoNBMEQuestion) {
  await db
    .update(stepTwoNbmeQuestions)
    .set(question)
    .where(eq(stepTwoNbmeQuestions.id, question.id));
}
