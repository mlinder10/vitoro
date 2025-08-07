"use server";

import { db, questions } from "@/db";
import { eq } from "drizzle-orm";

export async function fetchQuestionById(id: string) {
  const [question] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, id));

  return question;
}
