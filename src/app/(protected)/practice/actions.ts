"use server";

import {
  db,
  questions,
  answeredQuestions,
  reviewQuestions,
  qbankSessions,
} from "@/db";
import { eq, and, isNull, isNotNull, or, sql } from "drizzle-orm";
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
  questionIds: string[],
  flaggedIds: string[],
  answers: QuestionChoice[]
) {
  return await db
    .insert(qbankSessions)
    .values({
      userId,
      questionIds,
      flaggedQuestionIds: flaggedIds,
      answers,
    })
    .returning({ id: qbankSessions.id });
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

  const rows = await db
    .select({ q: questions })
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
        ...buildWhereClause(filters)
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(count);

  return rows.map((r) => r.q);
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
    .where(and(eq(questions.rating, "Pass"), ...buildWhereClause(filters)))
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!question) redirect("/practice/no-questions");

  redirect(`/practice/q/${question.id}`);
}

function buildWhereClause({
  step,
  type,
  status,
  statuses,
  system,
  category,
  subcategory,
  topic,
  difficulty,
  selectedLeafKeys,
}: QuestionFilters) {
  // Use statuses array if provided, otherwise fall back to single status
  const statusesToFilter = statuses && statuses.length > 0 ? statuses : (status ? [status] : []);
  
  // Build status filter conditions
  const statusConditions = statusesToFilter.map(statusValue => {
    switch (statusValue) {
      case "Correct":
        return and(isNotNull(answeredQuestions.userId), eq(answeredQuestions.answer, questions.answer));
      case "Incorrect":
        return and(isNotNull(answeredQuestions.userId), sql`${answeredQuestions.answer} != ${questions.answer}`);
      case "Answered":
        return isNotNull(answeredQuestions.userId);
      case "Unanswered":
        return isNull(answeredQuestions.userId);
      default:
        return undefined;
    }
  }).filter(Boolean);

  return [
    step && step !== "Mixed"
      ? or(eq(questions.step, step), eq(questions.step, "Mixed"))
      : undefined,
    type ? eq(questions.type, type) : undefined,
    // status filter (requires LEFT JOIN to answeredQuestions in queries)
    statusConditions.length > 0 ? or(...statusConditions) : undefined,
    system ? eq(questions.system, system) : undefined,
    category ? eq(questions.category, category) : undefined,
    subcategory ? eq(questions.subcategory, subcategory) : undefined,
    topic ? eq(questions.topic, topic) : undefined,
    difficulty ? eq(questions.difficulty, difficulty) : undefined,
    Array.isArray(selectedLeafKeys) && selectedLeafKeys.length > 0
      ? or(
          ...selectedLeafKeys
            .map((k) => {
              const parts = k.split("__");
              if (parts.length !== 3) return undefined as any;
              const [sys, cat, sub] = parts;
              return and(
                eq(questions.system, sys as any),
                eq(questions.category, cat as any),
                eq(questions.subcategory, sub as any)
              );
            })
            .filter(Boolean as any)
        )
      : undefined,
  ].filter((c) => c !== undefined);
}

export type GroupedCountRow = {
  system: string;
  category: string;
  subcategory: string;
  count: number;
};

// Grouped counts by system/category/subcategory, excluding answered by this user
export async function getCountsGrouped(
  userId: string,
  filters: QuestionFilters
) {
  const baseFilters: QuestionFilters = {
    ...filters,
    system: undefined,
    category: undefined,
    subcategory: undefined,
  };

  const rows = await db
    .select({
      system: questions.system,
      category: questions.category,
      subcategory: questions.subcategory,
      value: sql<number>`count(*)`,
    })
    .from(questions)
    .leftJoin(
      answeredQuestions,
      and(
        eq(answeredQuestions.questionId, questions.id),
        eq(answeredQuestions.userId, userId)
      )
    )
    .where(and(eq(questions.rating, "Pass"), ...buildWhereClause(baseFilters)))
    .groupBy(questions.system, questions.category, questions.subcategory);

  return rows.map((r) => ({
    system: r.system as string,
    category: r.category as string,
    subcategory: r.subcategory as string,
    count: (r as unknown as { value: number }).value ?? 0,
  })) satisfies GroupedCountRow[];
}

// Count available questions (excludes already answered by this user)
export async function countQuestions(
  userId: string,
  filters: QuestionFilters
) {
  const [{ value }] = await db
    .select({ value: sql<number>`count(*)` })
    .from(questions)
    .leftJoin(
      answeredQuestions,
      and(
        eq(answeredQuestions.questionId, questions.id),
        eq(answeredQuestions.userId, userId)
      )
    )
    .where(and(eq(questions.rating, "Pass"), ...buildWhereClause(filters)));

  return value ?? 0;
}
