import { InferSelectModel } from "drizzle-orm";
import { questions } from "@/db";

export type Question = InferSelectModel<typeof questions>;

export type QuestionChoice = "a" | "b" | "c" | "d" | "e";
export type QuestionDifficulty = "easy" | "moderate" | "hard";
export type NBMEStep = "step-1" | "step-2" | "mixed";
export type QuestionType = (typeof QUESTION_TYPES)[number];

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

export type Choices = {
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
};

export type GeneratedQuestion = {
  question: string;
  choices: Choices;
  answer: QuestionChoice;
  explanations: Choices;

  sources: string[];
  difficulty: QuestionDifficulty;
};

export function isValidGeneratedQuestion(question: GeneratedQuestion) {
  return (
    typeof question === "object" &&
    typeof question.question === "string" &&
    ["a", "b", "c", "d", "e"].includes(question.answer) &&
    typeof question.choices === "object" &&
    typeof question.choices.a === "string" &&
    typeof question.choices.b === "string" &&
    typeof question.choices.c === "string" &&
    typeof question.choices.d === "string" &&
    typeof question.choices.e === "string" &&
    typeof question.explanations === "object" &&
    typeof question.explanations.a === "string" &&
    typeof question.explanations.b === "string" &&
    typeof question.explanations.c === "string" &&
    typeof question.explanations.d === "string" &&
    typeof question.explanations.e === "string" &&
    Array.isArray(question.sources) &&
    ["easy", "moderate", "hard"].includes(question.difficulty)
  );
}
