"use server";

import db from "@/db/db";
import { QuestionChoice } from "@/types";

export async function fetchUnansweredQuestion(userId: string) {
  return await db.question.findFirst({
    where: {
      answeredQuestions: {
        none: {
          userId,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function resetProgress(userId: string) {
  await db.answeredQuestion.deleteMany({ where: { userId } });
}

export async function answerQuestion(
  userId: string,
  questionId: string,
  answer: QuestionChoice
) {
  await db.answeredQuestion.create({
    data: {
      userId,
      questionId,
      userAnswer: answer,
    },
  });
}
