"use server";

import { and, count, eq } from "drizzle-orm";
import { questions, audits } from "@/db";
import { db } from "@/db";
import {
  QuestionDifficulty,
  QuestionType,
  AuditRating,
  System,
  AnyCategory,
  AnySubcategory,
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
  const conditions = buildWhereClause({
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
    .where(conditions);

  const rows = await db
    .select({
      question: questions,
      audit: audits,
    })
    .from(questions)
    .leftJoin(audits, eq(questions.id, audits.questionId))
    .where(conditions)
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
  const clauses = [];

  if (filters.status) clauses.push(eq(audits.rating, filters.status));
  if (filters.difficulty)
    clauses.push(eq(questions.difficulty, filters.difficulty));
  if (filters.system) clauses.push(eq(questions.system, filters.system));
  if (filters.category) clauses.push(eq(questions.category, filters.category));
  if (filters.subcategory)
    clauses.push(eq(questions.subcategory, filters.subcategory));
  if (filters.type) clauses.push(eq(questions.type, filters.type));

  return clauses.length > 0 ? and(...clauses) : undefined;
}
