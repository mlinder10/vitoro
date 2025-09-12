// QBank

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

// Chat

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type SectionType =
  | "concept"
  | "example"
  | "equation"
  | "practice"
  | "summary";

export type Section = {
  id: string;
  title: string;
  content: string;
  type: SectionType;
  defaultExpanded?: boolean;
  icon?: string;
};

export type AIResponse = {
  id: string;
  sections: Section[];
  timestamp: Date;
  hasExpandableSections: boolean;
};

// Review

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
