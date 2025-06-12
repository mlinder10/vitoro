"use server";

import {
  encodeAudit,
  encodeQuestion,
  GeneratedAudit,
  GeneratedQuestion,
  parseQuestion,
  parseQuestionAudit,
} from "@/lib/types";
import db from "./db";

export async function fetchQuestions(
  offset: number,
  limit: number,
  auditRating?: "Pass" | "Flag for Human Review" | "Reject"
) {
  return (
    await db.question.findMany({
      where: auditRating ? { audit: { rating: auditRating } } : undefined,
      select: {
        id: true,
        topic: true,
        concept: true,
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
    })
  ).map(parseQuestionAudit);
}

export async function fetchQuestionById(id: string) {
  const question = await db.question.findUnique({
    where: { id },
    select: {
      id: true,
      topic: true,
      concept: true,
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
  question: GeneratedQuestion,
  audit: GeneratedAudit,
  creatorId: string
) {
  const encodedQuestion = encodeQuestion({
    ...question,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    creatorId,
  });
  const encodedAudit = encodeAudit({
    ...audit,
    id: crypto.randomUUID(),
    questionId: "", // doesn't matter since prisma automatically fills this
  });

  const auditWithoutQuestionId = {
    checklist: encodedAudit.checklist,
    suggestions: encodedAudit.suggestions,
    rating: encodedAudit.rating,
  };

  const savedQuestion = await db.question.create({
    data: {
      ...encodedQuestion,
      audit: {
        create: auditWithoutQuestionId,
      },
    },
  });

  return parseQuestion(savedQuestion);
}
