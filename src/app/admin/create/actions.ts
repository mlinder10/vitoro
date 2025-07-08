"use server";

import { db, questions } from "@/db";
import { Gemini, LLM, stripAndParse } from "@/llm";
import {
  AnyCategory,
  AnySubcategory,
  GeneratedQuestion,
  isValidGeneratedQuestion,
  Question,
  QUESTION_TYPES,
  QuestionType,
  System,
} from "@/types";
import { redirect } from "next/navigation";
import { z } from "zod";

// Types and Defaults ---------------------------------------------------------

const DEFAULT_QUESTION = (
  system: System,
  category: AnyCategory,
  subcategory: AnySubcategory,
  topic: string,
  type: QuestionType,
  userId: string
): Question => ({
  system,
  category,
  subcategory,
  topic,
  type,
  sources: [],
  creatorId: userId,
  createdAt: new Date(),
  id: crypto.randomUUID(),
  question: "",
  choices: { a: "", b: "", c: "", d: "", e: "" },
  answer: getRandomChoice(),
  explanations: { a: "", b: "", c: "", d: "", e: "" },
  difficulty: "Easy",
  step: "Mixed",
  rating: "Flag for Human Review",
});

const CHOICES = ["a", "b", "c", "d", "e"] as const;

function getRandomChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

// Form Action ----------------------------------------------------------------

const CreateQuestionSchema = z.object({
  topic: z.string(),
  system: z.string(),
  category: z.string(),
  subcategory: z.string(),
  type: z.enum(QUESTION_TYPES),
  action: z.enum(["create", "generate"]),
});

type CreateQuestionResult = {
  type?: string[];
  system?: string[];
  category?: string[];
  subcategory?: string[];
  error?: string;
};

export async function handleCreateQuestion(
  userId: string,
  _: unknown,
  formData: FormData
): Promise<CreateQuestionResult> {
  const result = CreateQuestionSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!result.success) {
    console.log(formData, result.error.formErrors.fieldErrors);
    return result.error.formErrors.fieldErrors;
  }
  const { topic, system, category, subcategory, type, action } = result.data;

  if (action === "create") {
    const res = await handleCreateBlankQuestion(
      userId,
      system as System,
      category as AnyCategory,
      subcategory as AnySubcategory,
      topic,
      type
    );
    if (res.error) return { error: res.error };
    redirect(`/admin/review/${res.id}`);
  } else if (action === "generate") {
    const res = await handleGenerateQuestion(
      userId,
      system as System,
      category as AnyCategory,
      subcategory as AnySubcategory,
      topic,
      type
    );
    if (res.error) return { error: res.error };
    redirect(`/admin/review/${res.id}`);
  }
  return { error: "Unknown action" };
}

// Generate -------------------------------------------------------------------

async function handleGenerateQuestion(
  userId: string,
  system: System,
  category: AnyCategory,
  subcategory: AnySubcategory,
  topic: string,
  type: QuestionType
) {
  try {
    const llm = new Gemini();
    const question = await generateQuestion(
      llm,
      system,
      category,
      subcategory,
      topic,
      type
    );
    if (!question)
      return { id: undefined, error: "Failed to generate question" };

    const [savedQuestion] = await db
      .insert(questions)
      .values({
        ...question,
        topic,
        system,
        category,
        subcategory,
        type,
        creatorId: userId,
        rating: "Flag for Human Review",
      })
      .returning({ id: questions.id });
    if (!savedQuestion)
      return { id: undefined, error: "Failed to save question" };

    return { id: savedQuestion.id, error: undefined };
  } catch (error) {
    console.error(error);
    return { id: undefined, error: "Failed to generate question" };
  }
}

async function generateQuestion(
  llm: LLM,
  system: System,
  category: AnyCategory,
  subcategory: AnySubcategory,
  topic: string,
  type: QuestionType
) {
  const prompt = `
  You are an expert item writer trained to create original, board-style multiple-choice questions for medical board exams (USMLE Step 1 or Step 2). Each question must test **clinical reasoning** using real-world logic, based on evidence-based medical sources.

  You are given:
  - A system 
  - A category within the system
  - A subcategory within the category
  - A clinical topic
  - A question type (e.g., Diagnosis, Complication, Lab finding, Next Step, First line, Risk factor)

  Use this information to generate a single, original multiple-choice question with:

  1. A realistic and non-obvious vignette that requires reasoning (not recall)
  2. One clearly correct answer
  3. Four plausible distractors (anchored to clues in the stem or similar diagnosis)
    Modifier: if you do not have a source to reference for a incorrect answer choice related to the topic, identify that answer choice and flag it for a admin to update the dataset with appropriate source.
  4. A full explanation:
    - Why the correct answer is right (with citation reference)
    - Why each incorrect option is wrong (anchored to stem or concept)

  ---
  Input:
  Topic: ${topic}
  System: ${system}
  Category: ${category as string}
  Question Type: ${type}
  Subcategory: ${subcategory as string}
  ---

  Output your result in this JSON format:

  {
    "question": <full stem> (string),
    "choices": {
      "a": <answer A> (string),
      "b": <answer B> (string),
      "c": <answer C> (string),
      "d": <answer D> (string),
      "e": <answer E> (string)
    },
    "answer": "a" | "b" | "c" | "d" | "e",
    "explanations": {
      "a": <explanation A> (string),
      "b": <explanation B> (string),
      "c": <explanation C> (string),
      "d": <explanation D> (string),
      "e": <explanation E> (string)
    },
    "sources": ["<source 1>", "<source 2>", etc.],
    "difficulty": "easy" | "moderate" | "hard",
    "nbmeStyleNotes": ["<note 1>", "<note 2>", etc.]
  }
  `;

  const result = await llm.prompt([{ type: "text", content: prompt }]);
  if (!result) throw new Error("Failed to generate question");
  const parsed = stripAndParse<GeneratedQuestion>(result);
  if (!parsed || !isValidGeneratedQuestion(parsed))
    throw new Error("Failed to parse question: " + result);
  return parsed;
}

// async function generateAudit(llm: LLM, question: GeneratedQuestion) {
//   const prompt = `
//   You are an exam-quality control agent trained in board-style question development. You have just generated the following board-style question. You must now review it using the audit checklist below and report whether it passes each item.

//   ---
//   Input:
//   Question: ${JSON.stringify(question)}
//   ---

//   Review each of the following checklist items. For each, return:
//   - Pass (Yes/No)
//   - Justification (brief explanation for your score)

//   Checklist:
//   1. One correct answer with all distractors clearly incorrect
//   2. Each distractor tests a plausible misunderstanding
//   3. Answer is consistent with vitals, labs, and imaging in the stem
//   4. No required data is missing for choosing the correct answer
//   5. Clinical presentation is realistic and not contradictory
//   6. Question requires clinical reasoning, not fact recall
//   7. No direct giveaway or naming of the diagnosis in the stem
//   8. Every answer choice is anchored to clues in the vignette
//   9. No duplicate correct answers or overly vague distractors

//   After the checklist, provide:
//   - A suggested revision if any item failed
//   - A final overall rating: Pass / Flag for Human Review / Reject

//   Respond in structured JSON format:
//   {
//     "checklist": {
//       "1": {"pass": true, "notes": "Clear single correct answer"},
//       "2": {"pass": false, "notes": "Distractor D is irrelevant to clinical reasoning"},
//       ...etc
//     },
//     "suggestions": ["Remove distractor D or replace with something clinically tempting but incorrect"],
//     "rating": "Flag for Human Review"
//   }
//   `;

//   const result = await llm.prompt([{ type: "text", content: prompt }]);
//   if (!result) throw new Error("Failed to generate audit");
//   const parsed = stripAndParse<GeneratedAudit>(result);
//   if (!parsed || !isValidGeneratedAudit(parsed))
//     throw new Error("Failed to parse audit: " + result);
//   return parsed;
// }

// Blank ----------------------------------------------------------------------

async function handleCreateBlankQuestion(
  userId: string,
  system: System,
  category: AnyCategory,
  subcategory: AnySubcategory,
  topic: string,
  type: QuestionType
) {
  try {
    const question = DEFAULT_QUESTION(
      system,
      category,
      subcategory,
      topic,
      type,
      userId
    );
    const [savedQuestion] = await db
      .insert(questions)
      .values(question)
      .returning({ id: questions.id });
    if (!savedQuestion)
      return { id: undefined, error: "Failed to save question" };

    return { id: savedQuestion.id, error: undefined };
  } catch (error) {
    console.error(error);
    return { id: undefined, error: "Failed to generate question" };
  }
}
