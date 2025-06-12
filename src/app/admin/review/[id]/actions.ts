"use server";

import db from "@/db/db";
import { AuditRating } from "@/lib/types";

export async function handleUpdateAuditStatus(
  questionId: string,
  rating: AuditRating
) {
  await db.audit.update({
    data: { rating },
    where: { questionId },
  });
}
