import { admins, reviewQuestions, users } from "@/db";
import { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export type Admin = InferSelectModel<typeof admins>;

export type ReviewQuestion = InferSelectModel<typeof reviewQuestions>;

export type Focus = "step-1" | "high-yield" | "nbme-mix";
export type QBankMode = "timed" | "tutor";

export type Task =
  | "breakdown"
  | "distractor"
  | "gap-finder"
  | "strategy"
  | "pattern"
  | "memory"
  | "pimp-mode";

export const TASKS: Task[] = [
  "breakdown",
  "distractor",
  "gap-finder",
  "strategy",
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
