"use server";

import { db, stepOneNbmeQuestions } from "@/db";
import { StepOneNBMEQuestion } from "@/types";
import { eq } from "drizzle-orm";

export async function saveQuestion(question: StepOneNBMEQuestion) {
  await db
    .update(stepOneNbmeQuestions)
    .set(question)
    .where(eq(stepOneNbmeQuestions.id, question.id));
}
