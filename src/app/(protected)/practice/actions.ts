"use server";

import {
  answeredQuestions,
  db,
  qbankSessions,
  stepOneNbmeQuestions,
  stepTwoNbmeQuestions,
  users,
} from "@/db";
import {
  capitalize,
  generateColor,
  generateRandomName,
} from "@/lib/utils";
import { hashPassword, getSession as getAuthSession } from "@/lib/auth";
import { Focus, NBMEStep, QBankMode, QuestionChoice } from "@/types";
import { isNull, eq, and, inArray } from "drizzle-orm";

// Create Session

export async function createQbankSession(
  userId: string,
  mode: QBankMode,
  step: NBMEStep,
  focus: Focus | undefined,
  count: number
) {
  await ensureUser(userId, step);
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

async function ensureUser(userId: string, exam: NBMEStep) {
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId));
  if (existing) return;

  const name = generateRandomName();
  const [first, last] = name.split("_").map(capitalize);
  await db.insert(users).values({
    id: userId,
    email: `${name}@example.com`,
    firstName: first,
    lastName: last,
    gradYear: new Date().getFullYear().toString(),
    exam,
    color: generateColor(),
    password: await hashPassword("password"),
  });
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
          answeredQuestions,
          and(
            eq(answeredQuestions.questionId, stepOneNbmeQuestions.id),
            eq(answeredQuestions.userId, userId)
          )
        )
        .where(
          and(
            eq(stepOneNbmeQuestions.rating, "Pass"),
            isNull(answeredQuestions.userId)
          )
        )
        .limit(count);
    case "Step 2":
      return await db
        .select({ id: stepTwoNbmeQuestions.id })
        .from(stepTwoNbmeQuestions)
        .leftJoin(
          answeredQuestions,
          and(
            eq(answeredQuestions.questionId, stepTwoNbmeQuestions.id),
            eq(answeredQuestions.userId, userId)
          )
        )
        .where(
          and(
            eq(stepTwoNbmeQuestions.rating, "Pass"),
            isNull(answeredQuestions.userId)
          )
        )
        .limit(count);
  }
}

// Get Session

export async function getSession({ id }: { id: string }) {
  const { id: userId } = await getAuthSession();
  const [session] = await db
    .select()
    .from(qbankSessions)
    .where(and(eq(qbankSessions.id, id), eq(qbankSessions.userId, userId)));
  if (!session) return null;

  const table =
    session.step === "Step 1" ? stepOneNbmeQuestions : stepTwoNbmeQuestions;
  const questions = await db
    .select()
    .from(table)
    .where(inArray(table.id, session.questionIds));

  return { session, questions };
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
