"use server";

import {
  answeredStepOneFoundationals,
  answeredStepTwoFoundationals,
  db,
  qbankSessions,
  stepOneFoundationalQuestions,
  stepTwoFoundationalQuestions,
} from "@/db";
import { and, eq } from "drizzle-orm";

export async function getSessions(userId: string) {
  const [sessions, stepOneFoundationals, stepTwoFoundationals] =
    await Promise.all([
      db.select().from(qbankSessions).where(eq(qbankSessions.userId, userId)),
      db
        .select({
          questionId: answeredStepOneFoundationals.foundationalQuestionId,
          subject: stepOneFoundationalQuestions.subject,
          answers: answeredStepOneFoundationals.answers,
          step: stepOneFoundationalQuestions.step,
        })
        .from(answeredStepOneFoundationals)
        .innerJoin(
          stepOneFoundationalQuestions,
          eq(
            answeredStepOneFoundationals.foundationalQuestionId,
            stepOneFoundationalQuestions.id
          )
        )
        .where(
          and(
            eq(answeredStepOneFoundationals.userId, userId),
            eq(answeredStepOneFoundationals.isComplete, false)
          )
        ),

      db
        .select({
          questionId: answeredStepTwoFoundationals.foundationalQuestionId,
          shelf: stepTwoFoundationalQuestions.shelf,
          answers: answeredStepTwoFoundationals.answers,
          step: stepTwoFoundationalQuestions.step,
        })
        .from(answeredStepTwoFoundationals)
        .innerJoin(
          stepTwoFoundationalQuestions,
          eq(
            answeredStepTwoFoundationals.foundationalQuestionId,
            stepTwoFoundationalQuestions.id
          )
        )
        .where(
          and(
            eq(answeredStepTwoFoundationals.userId, userId),
            eq(answeredStepTwoFoundationals.isComplete, false)
          )
        ),
    ]);
  return {
    sessions: sessions.toReversed(),
    stepOneFoundationals,
    stepTwoFoundationals,
  };
}

export async function updateSessionName(id: string, name: string) {
  await db.update(qbankSessions).set({ name }).where(eq(qbankSessions.id, id));
}

export async function deleteSession(id: string) {
  await db.delete(qbankSessions).where(eq(qbankSessions.id, id));
}
