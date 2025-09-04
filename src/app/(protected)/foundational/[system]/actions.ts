"use server";

import { answeredFoundationals, db } from "@/db";
import { getSession } from "@/lib/auth";
import { QuestionChoice, FoundationalFollowupAnswer } from "@/types";
import { and, eq } from "drizzle-orm";

export async function submitShortResponse(questionId: string, shortResponse: string) {
  const { id } = await getSession();
  await db.insert(answeredFoundationals).values({
    userId: id,
    foundationalQuestionId: questionId,
    shortResponse,
    answers: [],
  });
}

type SubmitFollowupAnswerArgs = {
  questionId: string;
  followupId: string;
  answers: FoundationalFollowupAnswer[];
  answer: QuestionChoice;
  total: number;
};

export async function submitFollowupAnswer({
  questionId,
  followupId,
  answers,
  answer,
  total,
}: SubmitFollowupAnswerArgs) {
  const { id } = await getSession();
  const newAnswers = [...answers, { id: followupId, answer }];
  await db
    .update(answeredFoundationals)
    .set({
      answers: newAnswers,
      isComplete: newAnswers.length >= total,
    })
    .where(
      and(
        eq(answeredFoundationals.userId, id),
        eq(answeredFoundationals.foundationalQuestionId, questionId)
      )
    );
}
