"use server";

import { db, stepOneNbmeQuestions, stepTwoNbmeQuestions } from "@/db";
import { Filters } from "./page";
import { and, like, sql, SQLWrapper } from "drizzle-orm";

export async function fetchNbmes(
  offset: number,
  limit: number,
  filters: Filters
) {
  const table =
    filters.step === "Step 1" ? stepOneNbmeQuestions : stepTwoNbmeQuestions;

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
