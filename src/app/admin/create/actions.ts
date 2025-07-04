"use server";

import { audits, db, questions } from "@/db";
import { generateAudit, generateQuestion } from "@/llm";
import {
  AnyCategory,
  AnySubcategory,
  ParsedAudit,
  Question,
  QuestionType,
  System,
} from "@/types";
import { redirect } from "next/navigation";

export type CreateQuestionError = {
  system?: string;
  category?: string;
  subcategory?: string;
  type?: string;
  error?: string;
};

export async function handleGenerateQuestion(
  userId: string,
  system: System,
  category: AnyCategory,
  subcategory: AnySubcategory,
  type: QuestionType
): Promise<CreateQuestionError> {
  try {
    const question = await generateQuestion(
      system as System,
      category,
      subcategory,
      type
    );
    if (!question) return { error: "Failed to generate question" };

    const audit = await generateAudit(question);
    if (!audit) return { error: "Failed to generate audit" };

    const [savedQuestion] = await db
      .insert(questions)
      .values({
        ...question,
        topic: "",
        concept: "",
        system,
        category,
        subcategory,
        type,
        creatorId: userId,
      })
      .returning({ id: questions.id });
    if (!savedQuestion) return { error: "Failed to save question" };

    await db.insert(audits).values({
      ...audit,
      questionId: savedQuestion.id,
    });

    redirect(`/admin/review/${savedQuestion.id}`);
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate question" };
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

const CHOICES = ["a", "b", "c", "d", "e"] as const;

function getRandomChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

export async function handleCreateBlankQuestion(
  userId: string,
  system: System,
  category: AnyCategory,
  subcategory: AnySubcategory,
  type: QuestionType
): Promise<CreateQuestionError> {
  try {
    const question: Question = {
      topic: "",
      concept: "",
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
    };

    const [savedQuestion] = await db
      .insert(questions)
      .values(question)
      .returning({ id: questions.id });
    if (!savedQuestion) return { error: "Failed to save question" };
    await db.insert(audits).values({
      rating: DEFAULT_RATING,
      suggestions: DEFAULT_SUGGESTIONS,
      checklist: DEFAULT_CHECKLIST,
      questionId: savedQuestion.id,
    });

    redirect(`/admin/review/${savedQuestion.id}`);
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate question" };
  }
}
