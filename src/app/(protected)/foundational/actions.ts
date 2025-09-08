"use server";

import { db, answeredFoundationals, foundationalQuestions } from "@/db";
import { and, eq } from "drizzle-orm";

export async function getIncomplete(userId: string) {
  return await db
    .select({
      questionId: answeredFoundationals.foundationalQuestionId,
      step: foundationalQuestions.step,
      system: foundationalQuestions.system,
      topic: foundationalQuestions.topic,
    })
    .from(answeredFoundationals)
    .innerJoin(
      foundationalQuestions,
      eq(answeredFoundationals.foundationalQuestionId, foundationalQuestions.id)
    )
    .where(
      and(
        eq(answeredFoundationals.userId, userId),
        eq(answeredFoundationals.isComplete, false)
      )
    );
}

export async function getAnswered(userId: string) {
  return await db
    .select({
      step: foundationalQuestions.step,
      system: foundationalQuestions.system,
      topic: foundationalQuestions.topic,
    })
    .from(answeredFoundationals)
    .innerJoin(
      foundationalQuestions,
      eq(answeredFoundationals.foundationalQuestionId, foundationalQuestions.id)
    )
    .where(
      and(
        eq(answeredFoundationals.userId, userId),
        eq(answeredFoundationals.isComplete, true)
      )
    );
}
