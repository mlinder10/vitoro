"use server";

import db from "@/db/db";
import { AuditStatus, encodeQuestion, ParsedQuestion } from "@/types";

export async function handleUpdateAuditStatus(
  questionId: string,
  rating: AuditStatus
) {
  await db.audit.update({
    data: { rating },
    where: { questionId },
  });
}

export async function handleSaveQuestionChanges(question: ParsedQuestion) {
  const encodedQuestion = encodeQuestion(question);
  await db.question.update({
    data: encodedQuestion,
    where: { id: question.id },
  });
}
