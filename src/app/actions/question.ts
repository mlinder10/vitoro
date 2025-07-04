"use server";

import { db, questions, audits } from "@/db";
import { eq } from "drizzle-orm";

export async function fetchQuestionById(id: string) {
  const [question] = await db
    .select({
      question: questions,
      audit: audits,
    })
    .from(questions)
    .leftJoin(audits, eq(questions.id, audits.questionId))
    .where(eq(questions.id, id));

  return question;
}
