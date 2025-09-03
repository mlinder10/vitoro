"use server";

import { and, count, eq } from "drizzle-orm";
import { stepTwoNbmeQuestions } from "@/db";
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
    .from(stepTwoNbmeQuestions)
    .where(clauses);

  const rows = await db
    .select()
    .from(stepTwoNbmeQuestions)
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
    filters.status
      ? eq(stepTwoNbmeQuestions.rating, filters.status)
      : undefined,
    filters.difficulty
      ? eq(stepTwoNbmeQuestions.difficulty, filters.difficulty)
      : undefined,
    filters.system
      ? eq(stepTwoNbmeQuestions.system, filters.system)
      : undefined,
    filters.category
      ? eq(stepTwoNbmeQuestions.category, filters.category)
      : undefined,
    filters.subcategory
      ? eq(stepTwoNbmeQuestions.subcategory, filters.subcategory)
      : undefined,
    filters.type ? eq(stepTwoNbmeQuestions.type, filters.type) : undefined,
  ].filter((c) => c !== undefined);

  return clauses.length > 0 ? and(...clauses) : undefined;
}

// Update Yield ------------------------------------------------------------

export async function updateYieldStatus(
  questionId: string,
  yieldType: YieldType
) {
  await db
    .update(stepTwoNbmeQuestions)
    .set({ yield: yieldType })
    .where(eq(stepTwoNbmeQuestions.id, questionId));
}
