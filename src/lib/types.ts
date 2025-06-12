import db from "@/db/db";
import { Question, Audit } from "@prisma/client";

// Question ===================================================================

export type QuestionChoice = "a" | "b" | "c" | "d" | "e";

export type QuestionDifficulty = "easy" | "moderate" | "hard";

export type GeneratedQuestion = {
  topic: string;
  concept: string;
  type: string;

  question: string;
  choices: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };
  answer: QuestionChoice;
  explanations: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };

  sources: string[];
  difficulty: QuestionDifficulty;
  nbmeStyleNotes: string[];
};

export type ParsedQuestion = GeneratedQuestion & {
  id: string;
  createdAt: Date;
  creatorId: string;
};

export function encodeQuestion(question: ParsedQuestion): Question {
  return {
    ...question,
    sources: JSON.stringify(question.sources),
    choices: JSON.stringify(question.choices),
    explanations: JSON.stringify(question.explanations),
    nbmeStyleNotes: JSON.stringify(question.nbmeStyleNotes),
  };
}

export function parseQuestion(encoded: Question): ParsedQuestion {
  return {
    ...encoded,
    sources: JSON.parse(encoded.sources),
    choices: JSON.parse(encoded.choices),
    answer: encoded.answer as QuestionChoice,
    explanations: JSON.parse(encoded.explanations),
    difficulty: encoded.difficulty as QuestionDifficulty,
    nbmeStyleNotes: JSON.parse(encoded.nbmeStyleNotes),
  };
}

// Audit ======================================================================

export type ChecklistItem = { pass: boolean; notes: string };

export type AuditRating = "Pass" | "Flag for Human Review" | "Reject";

export type GeneratedAudit = {
  checklist: {
    1: ChecklistItem;
    2: ChecklistItem;
    3: ChecklistItem;
    4: ChecklistItem;
    5: ChecklistItem;
    6: ChecklistItem;
    7: ChecklistItem;
    8: ChecklistItem;
    9: ChecklistItem;
  };
  suggestions: string[];
  rating: AuditRating;
};

export type ParsedAudit = GeneratedAudit & {
  id: string;
  questionId: string;
};

export function encodeAudit(audit: ParsedAudit): Audit {
  return {
    ...audit,
    checklist: JSON.stringify(audit.checklist),
    suggestions: JSON.stringify(audit.suggestions),
  };
}

export function parseAudit(encoded: Audit): ParsedAudit {
  return {
    ...encoded,
    checklist: JSON.parse(encoded.checklist),
    suggestions: JSON.parse(encoded.suggestions),
    rating: encoded.rating as AuditRating,
  };
}

// Question Audit Shared ======================================================

export type QuestionAudit = {
  question: ParsedQuestion;
  audit: ParsedAudit | null;
};

export function parseQuestionAudit(
  encoded: Question & { audit: Audit | null }
): { question: ParsedQuestion; audit: ParsedAudit | null } {
  return {
    question: parseQuestion(encoded),
    audit: encoded.audit ? parseAudit(encoded.audit) : null,
  };
}
