"use server";

import {
  answeredStepOneFoundationals,
  answeredStepTwoFoundationals,
  db,
  stepOneFoundationalQuestions,
  stepTwoFoundationalQuestions,
} from "@/db";
import {
  AnsweredStepOneFoundational,
  AnsweredStepTwoFoundational,
} from "@/types";
import { and, eq, notExists } from "drizzle-orm";

// Fetch

export async function fetchUnansweredStepOne(userId: string, subject: string) {
  const [row] = await db
    .select({ id: stepOneFoundationalQuestions.id })
    .from(stepOneFoundationalQuestions)
    .where(
      and(
        eq(stepOneFoundationalQuestions.subject, subject),
        notExists(
          db
            .select()
            .from(answeredStepOneFoundationals)
            .where(
              and(
                eq(answeredStepOneFoundationals.userId, userId),
                eq(
                  answeredStepOneFoundationals.foundationalQuestionId,
                  stepOneFoundationalQuestions.id
                ),
                eq(answeredStepOneFoundationals.isComplete, true)
              )
            )
        )
      )
    )
    .limit(1);

  return row?.id ?? null;
}

export async function fetchUnansweredStepTwo(userId: string, shelf: string) {
  const [row] = await db
    .select({ id: stepTwoFoundationalQuestions.id })
    .from(stepTwoFoundationalQuestions)
    .where(
      and(
        eq(stepTwoFoundationalQuestions.shelf, shelf),
        notExists(
          db
            .select()
            .from(answeredStepTwoFoundationals)
            .where(
              and(
                eq(answeredStepTwoFoundationals.userId, userId),
                eq(
                  answeredStepTwoFoundationals.foundationalQuestionId,
                  stepTwoFoundationalQuestions.id
                ),
                eq(answeredStepTwoFoundationals.isComplete, true)
              )
            )
        )
      )
    )
    .limit(1);

  return row?.id ?? null;
}

// Answer

export async function answerStepOneQuestion(
  answer: AnsweredStepOneFoundational,
  exists: boolean
) {
  if (exists) {
    await db
      .update(answeredStepOneFoundationals)
      .set(answer)
      .where(eq(answeredStepOneFoundationals.id, answer.id));
  } else {
    await db.insert(answeredStepOneFoundationals).values(answer);
  }
}

export async function answerStepTwoQuestion(
  answer: AnsweredStepTwoFoundational,
  exists: boolean
) {
  if (exists) {
    await db
      .update(answeredStepTwoFoundationals)
      .set(answer)
      .where(eq(answeredStepTwoFoundationals.id, answer.id));
  } else {
    await db.insert(answeredStepTwoFoundationals).values(answer);
  }
}
