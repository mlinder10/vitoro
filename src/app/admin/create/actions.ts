"use server";

import { saveQuestion } from "@/db/question";
import { generateAudit, generateQuestion } from "@/lib/gemini";
import { GeneratedQuestion } from "@/lib/types";
import { redirect } from "next/navigation";
import { z } from "zod";

const GenerateQuestionSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  concept: z.string().min(1, "Concept to test is required"),
  type: z.string().min(1, "Question type is required"),
  sources: z.string(),
});

export type GenerateQuestionResult =
  | ({ success?: true } & GeneratedQuestion)
  | {
      success?: false;
      topic?: string | string[];
      concept?: string | string[];
      type?: string | string[];
      sources?: string | string[];
    };

export async function handleGenerateQuestion(
  _: unknown,
  formData: FormData
): Promise<GenerateQuestionResult> {
  const parsed = GenerateQuestionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      success: false,
      ...parsed.error.formErrors.fieldErrors,
    };
  }

  const { topic, concept, type } = parsed.data;
  const question = await generateQuestion(topic, concept, type, []);
  const audit = await generateAudit(question);
  const saved = await saveQuestion(question, audit, "dev-admin");

  redirect(`/admin/review/${saved.id}`);
}
