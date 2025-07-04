"use server";

import { db, questions, answeredQuestions } from "@/db";
import { eq } from "drizzle-orm";
import { QuestionChoice } from "@/types";

export async function fetchUnansweredQuestion(userId: string) {
  const [question] = await db
    .select({ question: questions })
    .from(answeredQuestions)
    .leftJoin(questions, eq(questions.id, answeredQuestions.questionId))
    .where(eq(answeredQuestions.userId, userId))
    .limit(1);
  return question ? question.question : null;
}

export async function resetProgress(userId: string) {
  await db
    .delete(answeredQuestions)
    .where(eq(answeredQuestions.userId, userId));
}

export async function answerQuestion(
  userId: string,
  questionId: string,
  answer: QuestionChoice
) {
  await db.insert(answeredQuestions).values({
    userId,
    questionId,
    answer,
  });
}
