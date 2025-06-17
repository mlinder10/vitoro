import { Question } from "@prisma/client";
import { AnyCategory, AnySubcategory, System } from "./systems";

export type QuestionChoice = "a" | "b" | "c" | "d" | "e";

export type QuestionDifficulty = "easy" | "moderate" | "hard";

export const QUESTION_TYPES = [
  "Next Best Step",
  "Most Likely Diagnosis",
  "Most Likely Etiology",
  "Most Likely Complication",
  "Best Initial Test",
  "Most Accurate Test",
  "Mechanism of Disease / Pathophysiology",
  "Pharmacologic Mechanism / Adverse Effect",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export type GeneratedQuestion = {
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

  system: System;
  category: AnyCategory;
  subcategory: AnySubcategory;
  type: QuestionType;
};

export function encodeQuestion(question: ParsedQuestion): Question {
  return {
    id: question.id,
    system: question.system,
    category: question.category,
    subcategory: question.subcategory,
    type: question.type,
    createdAt: question.createdAt,
    creatorId: question.creatorId,
    question: question.question,
    answer: question.answer,
    difficulty: question.difficulty,
    sources: JSON.stringify(question.sources),
    choices: JSON.stringify(question.choices),
    explanations: JSON.stringify(question.explanations),
    nbmeStyleNotes: JSON.stringify(question.nbmeStyleNotes),
  };
}

export function parseQuestion(encoded: Question): ParsedQuestion {
  return {
    id: encoded.id,
    system: encoded.system as System,
    category: encoded.category as AnyCategory,
    subcategory: encoded.subcategory as AnySubcategory,
    type: encoded.type as QuestionType,
    createdAt: encoded.createdAt,
    creatorId: encoded.creatorId,
    question: encoded.question,
    sources: JSON.parse(encoded.sources),
    choices: JSON.parse(encoded.choices),
    answer: encoded.answer as QuestionChoice,
    explanations: JSON.parse(encoded.explanations),
    difficulty: encoded.difficulty as QuestionDifficulty,
    nbmeStyleNotes: JSON.parse(encoded.nbmeStyleNotes),
  };
}
