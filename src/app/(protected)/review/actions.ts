"use server";

import { db, reviewQuestions } from "@/db";
import { and, eq } from "drizzle-orm";

export async function getQuestions(userId: string) {
  const questions = await db
    .select()
    .from(reviewQuestions)
    .where(eq(reviewQuestions.userId, userId));

  return {
    answered: questions.filter((q) => q.passed),
    unanswered: questions.filter((q) => !q.passed),
  };
}

export async function getQuestion(id: string, userId: string) {
  const [question] = await db
    .select()
    .from(reviewQuestions)
    .where(
      and(eq(reviewQuestions.id, id), eq(reviewQuestions.userId, userId))
    );
  return question ?? null;
}
