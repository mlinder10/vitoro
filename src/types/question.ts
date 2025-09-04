import { InferSelectModel } from "drizzle-orm";
import {
  answeredStepOneFoundationals,
  answeredStepOneNbmes,
  answeredStepTwoFoundationals,
  answeredStepTwoNbmes,
  qbankSessions,
  stepOneFoundationalFollowUps,
  stepOneNbmeQuestions,
  stepTwoFoundationalFollowUps,
  stepTwoFoundationalQuestions,
  stepTwoNbmeQuestions,
} from "@/db";

// NBME

export type QBankSession = InferSelectModel<typeof qbankSessions>;

export type StepOneNBMEQuestion = InferSelectModel<typeof stepOneNbmeQuestions>;
export type StepTwoNBMEQuestion = InferSelectModel<typeof stepTwoNbmeQuestions>;
export type NBMEQuestion = StepOneNBMEQuestion | StepTwoNBMEQuestion;

export type AnsweredStepOneNBME = InferSelectModel<typeof answeredStepOneNbmes>;
export type AnsweredStepTwoNBME = InferSelectModel<typeof answeredStepTwoNbmes>;
export type AnsweredNBME = AnsweredStepOneNBME | AnsweredStepTwoNBME;

export type QuestionChoice = "a" | "b" | "c" | "d" | "e";
export type NBMEStep = (typeof NBME_STEPS)[number];
export type QuestionType = (typeof QUESTION_TYPES)[number];
export type QuestionDifficulty = (typeof QUESTION_DIFFICULTIES)[number];
export type AuditRating = (typeof QUESTION_RATINGS)[number];
export type YieldType = (typeof YIELD_TYPES)[number];

export const NBME_STEPS = ["Step 1", "Step 2"] as const;

export const QUESTION_TYPES = [
  "Diagnosis",
  "Management",
  "Mechanism",
  "Risk factor/epidemiology",
  "Complications",
  "Prognosis",
] as const;

export const QUESTION_DIFFICULTIES = ["Easy", "Moderate", "Hard"] as const;

export const QUESTION_RATINGS = [
  "Pass",
  "Flag for Human Review",
  "Reject",
] as const;

export const YIELD_TYPES = ["Low", "Medium", "High"] as const;

export type LabValue = {
  analyte: string;
  value: number;
  unit: string;
  qual: string | null;
  panel: string;
};

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

// Foundational

export type StepOneFoundationalQuestion = InferSelectModel<
  typeof stepOneNbmeQuestions
>;
export type StepTwoFoundationalQuestion = InferSelectModel<
  typeof stepTwoFoundationalQuestions
>;
export type FoundationalQuestion =
  | StepOneFoundationalQuestion
  | StepTwoFoundationalQuestion;

export type StepOneFoundationalFollowup = InferSelectModel<
  typeof stepOneFoundationalFollowUps
>;
export type StepTwoFoundationalFollowup = InferSelectModel<
  typeof stepTwoFoundationalFollowUps
>;
export type FoundationalFollowup =
  | StepOneFoundationalFollowup
  | StepTwoFoundationalFollowup;

export type AnsweredStepOneFoundational = InferSelectModel<
  typeof answeredStepOneFoundationals
>;
export type AnsweredStepTwoFoundational = InferSelectModel<
  typeof answeredStepTwoFoundationals
>;
export type AnsweredFoundational =
  | AnsweredStepOneFoundational
  | AnsweredStepTwoFoundational;
