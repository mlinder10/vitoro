"use server";

import { db, questions, answeredQuestions, audits } from "@/db";
import { eq, exists, not, and } from "drizzle-orm";
import { QuestionChoice } from "@/types";

export async function fetchUnansweredQuestion(userId: string) {
  const [question] = await db
    .select({ question: questions })
    .from(questions)
    .leftJoin(audits, eq(questions.id, audits.questionId))
    .where(
      and(
        eq(audits.rating, "Pass"),
        not(
          exists(
            db
              .select()
              .from(answeredQuestions)
              .where(
                and(
                  eq(answeredQuestions.userId, userId),
                  eq(answeredQuestions.questionId, questions.id)
                )
              )
          )
        )
      )
    )
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
