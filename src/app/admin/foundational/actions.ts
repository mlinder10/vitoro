"use server";

import {
  db,
  stepOneFoundationalQuestions,
  stepTwoFoundationalQuestions,
} from "@/db";
import { Filters } from "./page";
import { and, like, sql, SQLWrapper } from "drizzle-orm";

export async function fetchFoundationals(
  offset: number,
  limit: number,
  filters: Filters
) {
  const table =
    filters.step === "Step 1"
      ? stepOneFoundationalQuestions
      : stepTwoFoundationalQuestions;

  const clauses: SQLWrapper[] = [];

  if (filters.search.length > 0) {
    clauses.push(like(sql`LOWER(${table.question})`, `%${filters.search}%`));
  }

  return await db
    .select()
    .from(table)
    .where(and(...clauses))
    .offset(offset)
    .limit(limit);
}
