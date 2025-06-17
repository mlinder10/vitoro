"use server";

import { saveQuestion } from "@/db/question";
import { generateAudit, generateQuestion } from "@/llm";
import {
  AnyCategory,
  AnySubcategory,
  QUESTION_TYPES,
  QuestionType,
  System,
} from "@/types";
import { redirect } from "next/navigation";
import { z } from "zod";

export type GenerateQuestionResult = {
  topic?: string | string[];
  concept?: string | string[];
  type?: string | string[];
  sources?: string | string[];
};

const GenerateQuestionSchema = z.object({
  system: z.string({ required_error: "System is required" }),
  category: z.string({ required_error: "Category is required" }),
  subcategory: z.string({ required_error: "Subcategory is required" }),
  type: z.enum(QUESTION_TYPES, { required_error: "Question type is required" }),
});

export async function handleGenerateQuestion(
  userId: string,
  _: unknown,
  data: FormData
) {
  const parsed = GenerateQuestionSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return parsed.error.formErrors.fieldErrors;

  const system = parsed.data.system as System;
  const category = parsed.data.category as AnyCategory;
  const subcategory = parsed.data.subcategory as AnySubcategory;
  const type = parsed.data.type as QuestionType;
  const question = await generateQuestion(
    system as System,
    category,
    subcategory,
    type
  );
  const audit = await generateAudit(question);
  const saved = await saveQuestion(
    system,
    category,
    subcategory,
    type,
    question,
    audit,
    userId
  );

  redirect(`/admin/review/${saved.id}`);
}
