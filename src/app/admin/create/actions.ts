"use server";

import db from "@/db/db";
import { saveQuestion } from "@/db/question";
import { generateAudit, generateQuestion } from "@/llm";
import {
  AnyCategory,
  AnySubcategory,
  encodeQuestion,
  ParsedAudit,
  ParsedQuestion,
  QuestionType,
  System,
} from "@/types";

export type CreateQuestionError = {
  system?: string;
  category?: string;
  subcategory?: string;
  type?: string;
  error?: string;
};

type CreateQuestionResult =
  | { success: true; redirectTo: string }
  | ({ success: false } & CreateQuestionError);

export async function handleGenerateQuestion(
  userId: string,
  system: System,
  category: AnyCategory,
  subcategory: AnySubcategory,
  type: QuestionType
): Promise<CreateQuestionResult> {
  try {
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

    return { success: true, redirectTo: `/admin/review/${saved.id}` };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate question" };
  }
}

const DEFAULT_RATING: ParsedAudit["rating"] = "Flag for Human Review";
const DEFAULT_SUGGESTIONS: ParsedAudit["suggestions"] = [];
const DEFAULT_CHECKLIST: ParsedAudit["checklist"] = {
  "1": { pass: true, notes: "" },
  "2": { pass: true, notes: "" },
  "3": { pass: true, notes: "" },
  "4": { pass: true, notes: "" },
  "5": { pass: true, notes: "" },
  "6": { pass: true, notes: "" },
  "7": { pass: true, notes: "" },
  "8": { pass: true, notes: "" },
  "9": { pass: true, notes: "" },
};

export async function handleCreateBlankQuestion(
  userId: string,
  system: System,
  category: AnyCategory,
  subcategory: AnySubcategory,
  type: QuestionType
): Promise<CreateQuestionResult> {
  try {
    const question: ParsedQuestion = {
      system,
      category,
      subcategory,
      type,
      sources: [],
      creatorId: userId,
      createdAt: new Date(),
      id: crypto.randomUUID(),
      question: "",
      choices: {
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
      },
      answer: getRandomChoice(),
      explanations: {
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
      },
      difficulty: "easy",
      nbmeStyleNotes: [],
    };
    const encodedQuestion = encodeQuestion(question);

    const saved = await db.question.create({
      data: {
        ...encodedQuestion,
        audit: {
          create: {
            rating: DEFAULT_RATING,
            suggestions: JSON.stringify(DEFAULT_SUGGESTIONS),
            checklist: JSON.stringify(DEFAULT_CHECKLIST),
          },
        },
      },
    });

    return { success: true, redirectTo: `/admin/review/${saved.id}` };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate question" };
  }
}

const CHOICES = ["a", "b", "c", "d", "e"] as const;

function getRandomChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}
