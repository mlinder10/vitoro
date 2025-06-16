import { Audit, Question } from "@prisma/client";
import { parseAudit, ParsedAudit } from "./audit";
import { ParsedQuestion, parseQuestion } from "./question";

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
