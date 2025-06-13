"use server";

import db from "@/db/db";

export async function fetchUnansweredQuestion(userId: string) {
  return await db.question.findFirst({
    where: {
      answeredQuestions: {
        none: {
          userId,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
