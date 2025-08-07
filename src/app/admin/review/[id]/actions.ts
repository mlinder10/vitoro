"use server";

import { db, questions } from "@/db";
import { AuditRating, Question } from "@/types";
import { eq } from "drizzle-orm";

export async function handleUpdateAuditStatus(
  questionId: string,
  rating: AuditRating
) {
  await db
    .update(questions)
    .set({ rating })
    .where(eq(questions.id, questionId));
}

export async function handleSaveQuestionChanges(question: Question) {
  await db.update(questions).set(question).where(eq(questions.id, question.id));
}
