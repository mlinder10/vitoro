"use server";

import { and, count, eq } from "drizzle-orm";
import { questions } from "@/db";
import { db } from "@/db";
import {
  QuestionDifficulty,
  QuestionType,
  AuditRating,
  System,
  AnyCategory,
  AnySubcategory,
  YieldType,
} from "@/types";

export async function fetchQuestionsWithAudits(
  offset: number,
  limit: number,
  status?: AuditRating,
  difficulty?: QuestionDifficulty,
  system?: System,
  category?: AnyCategory,
  subcategory?: AnySubcategory,
  type?: QuestionType
) {
  const clauses = buildWhereClause({
    status,
    difficulty,
    system,
    category,
    subcategory,
    type,
  });

  const countResult = await db
    .select({ count: count() })
    .from(questions)
    .where(clauses);

  const rows = await db
    .select()
    .from(questions)
    .where(clauses)
    .offset(offset)
    .limit(limit);

  return {
    count: countResult[0]?.count ?? 0,
    questions: rows,
  };
}

function buildWhereClause(filters: {
  status?: AuditRating;
  difficulty?: QuestionDifficulty;
  system?: System;
  category?: AnyCategory;
  subcategory?: AnySubcategory;
  type?: QuestionType;
}) {
  const clauses = [
    filters.status ? eq(questions.rating, filters.status) : undefined,
    filters.difficulty
      ? eq(questions.difficulty, filters.difficulty)
      : undefined,
    filters.system ? eq(questions.system, filters.system) : undefined,
    filters.category ? eq(questions.category, filters.category) : undefined,
    filters.subcategory
      ? eq(questions.subcategory, filters.subcategory)
      : undefined,
    filters.type ? eq(questions.type, filters.type) : undefined,
  ].filter((c) => c !== undefined);

  return clauses.length > 0 ? and(...clauses) : undefined;
}

// Update Yield ------------------------------------------------------------

export async function updateYieldStatus(
  questionId: string,
  yieldType: YieldType
) {
  await db
    .update(questions)
    .set({ yield: yieldType })
    .where(eq(questions.id, questionId));
}
