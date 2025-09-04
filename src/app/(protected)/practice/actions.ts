"use server";

import {
  answeredStepOneNbmes,
  answeredStepTwoNbmes,
  db,
  qbankSessions,
  stepOneNbmeQuestions,
  stepTwoNbmeQuestions,
} from "@/db";
import { generateRandomName } from "@/lib/utils";
import { Focus, NBMEStep, QBankMode, QuestionChoice } from "@/types";
import { isNull, eq, and } from "drizzle-orm";

// Create Session

export async function createQbankSession(
  userId: string,
  mode: QBankMode,
  step: NBMEStep,
  focus: Focus | undefined,
  count: number
) {
  const qs = await fetchQuestions(userId, step, focus, count);

  const questionIds = qs.map((q) => q.id);
  const answers: (QuestionChoice | null)[] = new Array(questionIds.length).fill(
    null
  );

  const [{ id }] = await db
    .insert(qbankSessions)
    .values({
      userId,
      mode,
      questionIds,
      flaggedQuestionIds: [],
      answers,
      name: generateRandomName(),
      step,
    })
    .returning({ id: qbankSessions.id });

  return id;
}

async function fetchQuestions(
  userId: string,
  step: NBMEStep,
  focus: Focus | undefined,
  count: number
) {
  switch (step) {
    case "Step 1":
      return await db
        .select({ id: stepOneNbmeQuestions.id })
        .from(stepOneNbmeQuestions)
        .leftJoin(
          answeredStepOneNbmes,
          and(
            eq(answeredStepOneNbmes.questionId, stepOneNbmeQuestions.id),
            eq(answeredStepOneNbmes.userId, userId)
          )
        )
        .where(
          and(
            eq(stepOneNbmeQuestions.rating, "Pass"),
            isNull(answeredStepOneNbmes.userId)
          )
        )
        .limit(count);
    case "Step 2":
      return await db
        .select({ id: stepTwoNbmeQuestions.id })
        .from(stepTwoNbmeQuestions)
        .leftJoin(
          answeredStepTwoNbmes,
          and(
            eq(answeredStepTwoNbmes.questionId, stepTwoNbmeQuestions.id),
            eq(answeredStepTwoNbmes.userId, userId)
          )
        )
        .where(
          and(
            eq(stepTwoNbmeQuestions.rating, "Pass"),
            isNull(answeredStepTwoNbmes.userId)
          )
        )
        .limit(count);
  }
}

// Answer Question

type AnswerQuestionArgs = {
  userId: string;
  questionId: string;
  sessionId: string;
  answer: QuestionChoice;
  answers: (QuestionChoice | null)[];
  step: NBMEStep;
};

export async function answerQuestion({
  userId,
  questionId,
  sessionId,
  answer,
  answers,
  step,
}: AnswerQuestionArgs) {
  await Promise.all([
    db
      .insert(step === "Step 1" ? answeredStepOneNbmes : answeredStepTwoNbmes)
      .values({
        userId,
        questionId,
        answer,
      }),
    db
      .update(qbankSessions)
      .set({ answers })
      .where(eq(qbankSessions.id, sessionId)),
  ]);
}

// Flag Question

export async function updateFlaggedQuestions(
  sessionId: string,
  flaggedQuestionIds: string[]
) {
  await db
    .update(qbankSessions)
    .set({ flaggedQuestionIds: flaggedQuestionIds })
    .where(eq(qbankSessions.id, sessionId));
}

// End Session

export async function endSession(sessionId: string) {
  await db
    .update(qbankSessions)
    .set({ inProgress: false })
    .where(eq(qbankSessions.id, sessionId));
}

// Rest Questions

export async function resetQuestions(userId: string) {
  await Promise.all([
    db
      .delete(answeredStepOneNbmes)
      .where(eq(answeredStepOneNbmes.userId, userId)),
    db
      .delete(answeredStepTwoNbmes)
      .where(eq(answeredStepTwoNbmes.userId, userId)),
  ]);
}
