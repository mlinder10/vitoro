"use server";

import {
  db,
  questions,
  answeredQuestions,
  reviewQuestions,
  qbankSessions,
} from "@/db";
import { eq, and, isNull, or, sql, notInArray } from "drizzle-orm";
import {
  GeneratedReviewQuestion,
  isValidGeneratedReviewQuestion,
  Question,
  QuestionChoice,
} from "@/types";
import { Gemini, stripAndParse } from "@/ai";
import { QuestionFilters } from "@/contexts/qbank-session-provider";
import { redirect } from "next/navigation";

export async function resetProgress(userId: string) {
  await db
    .delete(answeredQuestions)
    .where(eq(answeredQuestions.userId, userId));
}

export async function checkForActiveSession(userId: string) {
  const [session] = await db
    .select()
    .from(qbankSessions)
    .where(
      and(eq(qbankSessions.userId, userId), eq(qbankSessions.inProgress, true))
    )
    .limit(1);
  return session ?? null;
}

// Records

export async function createAnswerRecord(
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

export async function createQbankSession(
  userId: string,
  questionIds: string[]
) {
  const [{ id }] = await db
    .insert(qbankSessions)
    .values({
      userId,
      questionIds,
      flaggedQuestionIds: [],
      answers: [],
    })
    .returning({ id: qbankSessions.id });
  return id;
}

type UpdateQbankSessionArgs = {
  id: string;
  flaggedIds?: string[];
  answers?: (QuestionChoice | null)[];
  inProgress?: boolean;
};

export async function updateQbankSession({
  id,
  flaggedIds,
  answers,
  inProgress,
}: UpdateQbankSessionArgs) {
  const setClause: Record<string, unknown> = {};
  if (flaggedIds !== undefined) setClause["flaggedQuestionIds"] = flaggedIds;
  if (answers !== undefined) setClause["answers"] = answers;
  if (inProgress !== undefined) setClause["inProgress"] = inProgress;
  await db.update(qbankSessions).set(setClause).where(eq(qbankSessions.id, id));
}

// Review Questions -----------------------------------------------------------

export async function createReviewQuestion(
  question: Question,
  answer: QuestionChoice,
  userId: string
) {
  const prompt = `
    You are an NBME exam tutor.

    A student was just presented this question:
    Stem: ${question.question}
    Choices: ${JSON.stringify(question.choices)}
    Explanations: ${JSON.stringify(question.explanations)}
    Answer: ${question.answer}

    The student selected: ${answer}

    Please generate a review question based on this question and the student's answer.

    Please respond in the following JSON format:

    {
      "question": "<review question>",
      "answerCriteria": ["<answer criteria>"]
    }
  `;

  const llm = new Gemini();
  const result = await llm.prompt([{ type: "text", content: prompt }]);

  if (!result) throw new Error("Failed to generate text");
  const parsed = stripAndParse<GeneratedReviewQuestion>(result);
  if (!parsed) throw new Error("Failed to parse JSON");
  if (!isValidGeneratedReviewQuestion(parsed))
    throw new Error("Invalid JSON: " + result);

  await db.insert(reviewQuestions).values({
    ...parsed,
    questionId: question.id,
    userId,
  });
}

// Filtered Questions ---------------------------------------------------------

export async function fetchQuestions(
  userId: string,
  filters: QuestionFilters,
  count: number
) {
  if (count > 50) throw new Error("Too many questions requested");

  const answered = await db
    .select({ id: answeredQuestions.questionId })
    .from(answeredQuestions)
    .where(eq(answeredQuestions.userId, userId));

  return await db
    .select()
    .from(questions)
    .where(
      and(
        eq(questions.rating, "Pass"),
        ...buildWhereClause(filters),
        notInArray(
          questions.id,
          answered.map((q) => q.id)
        )
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(count);
}

export async function redirectToQuestion(
  userId: string,
  filters: QuestionFilters
) {
  const [question] = await db
    .select({ id: questions.id })
    .from(questions)
    .leftJoin(
      answeredQuestions,
      and(
        eq(answeredQuestions.questionId, questions.id),
        eq(answeredQuestions.userId, userId)
      )
    )
    .where(
      and(
        eq(questions.rating, "Pass"),
        ...buildWhereClause(filters),
        isNull(answeredQuestions.userId)
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!question) redirect("/practice/no-questions");

  redirect(`/practice/q/${question.id}`);
}

function buildWhereClause({
  step,
  type,
  system,
  category,
  subcategory,
  topic,
  difficulty,
}: QuestionFilters) {
  return [
    step && step !== "Mixed"
      ? or(eq(questions.step, step), eq(questions.step, "Mixed"))
      : undefined,
    type ? eq(questions.type, type) : undefined,
    system ? eq(questions.system, system) : undefined,
    category ? eq(questions.category, category) : undefined,
    subcategory ? eq(questions.subcategory, subcategory) : undefined,
    topic ? eq(questions.topic, topic) : undefined,
    difficulty ? eq(questions.difficulty, difficulty) : undefined,
  ].filter((c) => c !== undefined);
}
