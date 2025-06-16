import { Question } from "@prisma/client";

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
    id: question.id,
    topic: question.topic,
    concept: question.concept,
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
    topic: encoded.topic,
    concept: encoded.concept,
    type: encoded.type,
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
