import { reviewQuestions } from "@/db";
import { InferSelectModel } from "drizzle-orm";

export type ReviewQuestion = InferSelectModel<typeof reviewQuestions>;

export type Focus = "step-1" | "high-yield" | "nbme-mix";
export type QBankMode = "timed" | "tutor";

export type Task =
  | "auto-triage"
  | "breakdown"
  | "distractor"
  | "gap-finder"
  | "strategy"
  | "timing"
  | "pattern"
  | "memory"
  | "pimp-mode";

export const TASKS: Task[] = [
  "auto-triage",
  "breakdown",
  "distractor",
  "gap-finder",
  "strategy",
  "timing",
  "pattern",
  "memory",
  "pimp-mode",
];

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type GeneratedReviewQuestion = {
  question: string;
  answerCriteria: string[];
};

export function isValidGeneratedReviewQuestion(
  question: GeneratedReviewQuestion
) {
  return (
    typeof question === "object" &&
    typeof question.question === "string" &&
    Array.isArray(question.answerCriteria)
  );
}
