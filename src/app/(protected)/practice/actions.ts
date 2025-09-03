"use server";

import { answeredQuestions, db, qbankSessions, nbmeQuestions } from "@/db";
import { generateRandomName } from "@/lib/utils";
import { Focus, QBankMode, QuestionChoice } from "@/types";
import { isNull, eq, and } from "drizzle-orm";

// Create Session

export async function createQbankSession(
  userId: string,
  mode: QBankMode,
  focus: Focus | undefined,
  count: number
) {
  const qs = await db
    .select({ id: nbmeQuestions.id })
    .from(nbmeQuestions)
    .leftJoin(
      answeredQuestions,
      and(
        eq(answeredQuestions.questionId, nbmeQuestions.id),
        eq(answeredQuestions.userId, userId)
      )
    )
    .where(buildWhereClause(focus))
    .limit(count);

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
    })
    .returning({ id: qbankSessions.id });

  return id;
}

function buildWhereClause(focus: Focus | undefined) {
  const conditions = [];
  conditions.push(eq(nbmeQuestions.rating, "Pass"));
  conditions.push(isNull(answeredQuestions.userId));
  switch (focus) {
    case undefined:
      break;
    case "high-yield":
      conditions.push(eq(nbmeQuestions.yield, "High"));
      break;
    case "nbme-mix":
      break;
    case "step-1":
      conditions.push(eq(nbmeQuestions.step, "Step 1"));
      break;
  }
  return and(...conditions);
}

// Answer Question

type AnswerQuestionArgs = {
  userId: string;
  questionId: string;
  sessionId: string;
  answer: QuestionChoice;
  answers: (QuestionChoice | null)[];
};

export async function answerQuestion({
  userId,
  questionId,
  sessionId,
  answer,
  answers,
}: AnswerQuestionArgs) {
  await Promise.all([
    db.insert(answeredQuestions).values({
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
  await db
    .delete(answeredQuestions)
    .where(eq(answeredQuestions.userId, userId));
}
