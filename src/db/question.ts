"use server";

import {
  AnyCategory,
  AnySubcategory,
  AuditStatus,
  encodeAudit,
  encodeQuestion,
  GeneratedAudit,
  GeneratedQuestion,
  parseQuestion,
  parseQuestionAudit,
  QuestionDifficulty,
  QuestionType,
  System,
} from "@/types";
import db from "./db";

export async function fetchQuestions(
  offset: number,
  limit: number,
  status: AuditStatus | undefined,
  difficulty: QuestionDifficulty | undefined,
  system: System | undefined,
  category: AnyCategory | undefined,
  subcategory: AnySubcategory | undefined,
  type: QuestionType | undefined
) {
  const where = buildWhereClause(
    status,
    difficulty,
    system,
    category,
    subcategory,
    type
  );
  const [count, questions] = await Promise.all([
    db.question.count({ where }),
    db.question.findMany({
      where,
      select: {
        id: true,
        system: true,
        category: true,
        subcategory: true,
        type: true,
        question: true,
        choices: true,
        answer: true,
        explanations: true,
        sources: true,
        difficulty: true,
        nbmeStyleNotes: true,
        createdAt: true,
        creatorId: true,
        audit: true,
      },
      skip: offset,
      take: limit,
    }),
  ]);
  return {
    count,
    questions: questions.map(parseQuestionAudit),
  };
}

type WhereClause = {
  audit?: { rating: AuditStatus };
  difficulty?: QuestionDifficulty;
  system?: System;
  category?: AnyCategory;
  subcategory?: AnySubcategory;
  type?: QuestionType;
};

function buildWhereClause(
  status: AuditStatus | undefined,
  difficulty: QuestionDifficulty | undefined,
  system: System | undefined,
  category: AnyCategory | undefined,
  subcategory: AnySubcategory | undefined,
  type: QuestionType | undefined
) {
  const where = {} as WhereClause;
  if (status) where.audit = { rating: status };
  if (difficulty) where.difficulty = difficulty;
  if (system) where.system = system;
  if (category) where.category = category;
  if (subcategory) where.subcategory = subcategory;
  if (type) where.type = type;
  return where;
}

export async function fetchQuestionById(id: string) {
  const question = await db.question.findUnique({
    where: { id },
    select: {
      id: true,
      system: true,
      category: true,
      subcategory: true,
      type: true,
      question: true,
      choices: true,
      answer: true,
      explanations: true,
      sources: true,
      difficulty: true,
      nbmeStyleNotes: true,
      createdAt: true,
      creatorId: true,
      audit: true,
    },
  });
  return question ? parseQuestionAudit(question) : null;
}

export async function saveQuestion(
  system: System,
  category: AnyCategory,
  subcategory: AnySubcategory,
  type: QuestionType,
  question: GeneratedQuestion,
  audit: GeneratedAudit,
  creatorId: string
) {
  const encodedQuestion = encodeQuestion({
    ...question,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    creatorId,
    system,
    category,
    subcategory,
    type,
  });
  const encodedAudit = encodeAudit({
    ...audit,
    id: crypto.randomUUID(),
    questionId: encodedQuestion.id,
  });

  const savedQuestion = await db.question.create({
    data: {
      ...encodedQuestion,
      audit: {
        create: {
          id: encodedAudit.id,
          checklist: encodedAudit.checklist,
          suggestions: encodedAudit.suggestions,
          rating: encodedAudit.rating,
        },
      },
    },
  });
  return parseQuestion(savedQuestion);
}
