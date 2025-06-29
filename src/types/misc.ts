import { Audit, Question } from "@prisma/client";
import { parseAudit, ParsedAudit } from "./audit";
import { ParsedQuestion, parseQuestion } from "./question";

export type QuestionAudit = {
  question: ParsedQuestion;
  audit: ParsedAudit | null;
};

export function parseQuestionAudit(
  encoded: Question & { audit: Audit | null }
): QuestionAudit | null {
  const question = parseQuestion(encoded);
  if (!question) return null;
  return {
    question,
    audit: encoded.audit ? parseAudit(encoded.audit) : null,
  };
}
