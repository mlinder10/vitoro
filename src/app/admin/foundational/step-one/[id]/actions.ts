"use server";

import {
  db,
  stepOneFoundationalFollowUps,
  stepOneFoundationalQuestions,
} from "@/db";
import {
  StepOneFoundationalFollowup,
  StepOneFoundationalQuestion,
} from "@/types";
import { eq } from "drizzle-orm";

export async function saveQuestion(
  base: StepOneFoundationalQuestion,
  followups: StepOneFoundationalFollowup[]
) {
  const promises: Promise<unknown>[] = [
    db
      .update(stepOneFoundationalQuestions)
      .set(base)
      .where(eq(stepOneFoundationalQuestions.id, base.id)),
  ];

  if (followups.length > 0) {
    promises.push(
      db
        .delete(stepOneFoundationalFollowUps)
        .where(
          eq(stepOneFoundationalFollowUps.foundationalQuestionId, base.id)
        ),
      db.insert(stepOneFoundationalFollowUps).values(followups)
    );
  }

  await Promise.all(promises);
}
