import { reviewQuestions } from "@/db";
import { InferSelectModel } from "drizzle-orm";

export type ReviewQuestion = InferSelectModel<typeof reviewQuestions>;

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
