"use server";

import { db, stepTwoNbmeQuestions } from "@/db";
import { StepTwoNBMEQuestion } from "@/types";
import { eq } from "drizzle-orm";

export async function saveQuestion(question: StepTwoNBMEQuestion) {
  await db
    .update(stepTwoNbmeQuestions)
    .set(question)
    .where(eq(stepTwoNbmeQuestions.id, question.id));
}
