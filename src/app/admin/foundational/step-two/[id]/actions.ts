"use server";

import {
  db,
  stepTwoFoundationalFollowUps,
  stepTwoFoundationalQuestions,
} from "@/db";
import {
  StepTwoFoundationalFollowup,
  StepTwoFoundationalQuestion,
} from "@/types";
import { eq } from "drizzle-orm";

export async function saveQuestion(
  base: StepTwoFoundationalQuestion,
  followups: StepTwoFoundationalFollowup[]
) {
  const promises: Promise<unknown>[] = [
    db
      .update(stepTwoFoundationalQuestions)
      .set(base)
      .where(eq(stepTwoFoundationalQuestions.id, base.id)),
  ];

  if (followups.length > 0) {
    promises.push(
      db
        .delete(stepTwoFoundationalFollowUps)
        .where(
          eq(stepTwoFoundationalFollowUps.foundationalQuestionId, base.id)
        ),
      db.insert(stepTwoFoundationalFollowUps).values(followups)
    );
  }

  await Promise.all(promises);
}
