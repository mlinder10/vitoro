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
import { NBMEStep, QBankMode, QuestionChoice } from "@/types";
import { isNull, eq, and, inArray } from "drizzle-orm";

// Create Session

export async function createQbankSession(
  userId: string,
  mode: QBankMode,
  step: NBMEStep,
  count: number,
  systems: string[],
  categories: string[],
  types: string[]
) {
  const qs = await fetchQuestions(
    userId,
    step,
    count,
    systems,
    categories,
    types
  );

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

// async function fetchQuestions(
//   userId: string,
//   step: NBMEStep,
//   count: number,
//   systems: string[],
//   categories: string[],
//   types: string[]
// ) {
//   switch (step) {
//     case "Step 1":
//       return await db
//         .select({ id: stepOneNbmeQuestions.id })
//         .from(stepOneNbmeQuestions)
//         .leftJoin(
//           answeredStepOneNbmes,
//           and(
//             eq(answeredStepOneNbmes.questionId, stepOneNbmeQuestions.id),
//             eq(answeredStepOneNbmes.userId, userId)
//           )
//         )
//         .where(
//           and(
//             // TODO: find a way to add systems and categories
//             eq(stepOneNbmeQuestions.rating, "Pass"),
//             isNull(answeredStepOneNbmes.userId)
//           )
//         )
//         .orderBy(sql`RANDOM()`)
//         .limit(count);
//     case "Step 2":
//       return await db
//         .select({ id: stepTwoNbmeQuestions.id })
//         .from(stepTwoNbmeQuestions)
//         .leftJoin(
//           answeredStepTwoNbmes,
//           and(
//             eq(answeredStepTwoNbmes.questionId, stepTwoNbmeQuestions.id),
//             eq(answeredStepTwoNbmes.userId, userId)
//           )
//         )
//         .where(
//           and(
//             systems.length > 0
//               ? inArray(stepTwoNbmeQuestions.system, systems)
//               : undefined,
//             categories.length > 0
//               ? inArray(stepTwoNbmeQuestions.category, categories)
//               : undefined,
//             types.length > 0
//               ? inArray(stepTwoNbmeQuestions.type, types)
//               : undefined,
//             eq(stepTwoNbmeQuestions.rating, "Pass"),
//             isNull(answeredStepTwoNbmes.userId)
//           )
//         )
//         .orderBy(sql`RANDOM()`)
//         .limit(count);
//   }
// }

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function fetchQuestions(
  userId: string,
  step: NBMEStep,
  count: number,
  systems: string[],
  categories: string[],
  types: string[]
) {
  const { questions, answered } =
    step === "Step 1"
      ? { questions: stepOneNbmeQuestions, answered: answeredStepOneNbmes }
      : { questions: stepTwoNbmeQuestions, answered: answeredStepTwoNbmes };

  const conditions = [eq(questions.rating, "Pass"), isNull(answered.userId)];

  if (questions === stepTwoNbmeQuestions) {
    if (systems.length) conditions.push(inArray(questions.system, systems));
    if (categories.length)
      conditions.push(inArray(questions.category, categories));
    if (types.length) conditions.push(inArray(questions.type, types));
  }

  const whereClause = and(...conditions);

  const ids = await db
    .select({ id: questions.id })
    .from(questions)
    .leftJoin(
      answered,
      and(eq(answered.questionId, questions.id), eq(answered.userId, userId))
    )
    .where(whereClause);

  if (!ids.length) return [];

  const randomIds = shuffle(ids.map((row) => row.id)).slice(0, count);

  const selectedQuestions = await db
    .select()
    .from(questions)
    .where(inArray(questions.id, randomIds));

  return selectedQuestions;
}

// Get Session

// TODO: maybe check if session belongs to user
export async function getSummary(id: string) {
  const [session] = await db
    .select()
    .from(qbankSessions)
    .where(eq(qbankSessions.id, id));
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

// Questions Data

export async function fetchStepOneData() {
  const [competencies, concepts] = await Promise.all([
    db
      .selectDistinct({
        competency: stepOneNbmeQuestions.competency,
      })
      .from(stepOneNbmeQuestions),
    db
      .selectDistinct({ concept: stepOneNbmeQuestions.concept })
      .from(stepOneNbmeQuestions),
  ]);
  return {
    competencies: competencies.map((c) => c.competency),
    concepts: concepts.map((c) => c.concept),
  };
}

export async function fetchStepTwoData() {
  const [systems, types] = await Promise.all([
    db
      .selectDistinct({ system: stepTwoNbmeQuestions.system })
      .from(stepTwoNbmeQuestions),
    db
      .selectDistinct({ type: stepTwoNbmeQuestions.type })
      .from(stepTwoNbmeQuestions),
  ]);
  return {
    systems: systems.map((s) => s.system),
    types: types.map((t) => t.type),
  };
}
