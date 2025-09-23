"use server";

import { GeneratedFlashcard, NBMEQuestion } from "@/types";
import { getFlashcardSystemPrompt } from "./prompts";
import { Gemini } from "@/ai";
import { stripAndParse } from "@/lib/utils";
import { db, flashcardFolders, flashcards } from "@/db";
import { eq } from "drizzle-orm";

type GeneratedFlashcards = {
  basic: GeneratedFlashcard;
  cloze: GeneratedFlashcard;
};

export async function generateFlashcard(question: NBMEQuestion) {
  const flashcardPrompt = getFlashcardSystemPrompt(question);

  const llm = new Gemini();
  const output = await llm.prompt([
    { role: "user", content: flashcardPrompt, type: "text" },
  ]);
  const cards = stripAndParse<GeneratedFlashcards>(output.text);
  if (!cards)
    throw new Error(`No flashcards generated, ${output.text}, ${cards}`);
  return cards;
}

export async function fetchFolders(userId: string) {
  return await db
    .select()
    .from(flashcardFolders)
    .where(eq(flashcardFolders.userId, userId));
}

export async function createFolder(name: string, userId: string) {
  const [folder] = await db
    .insert(flashcardFolders)
    .values({ name, userId })
    .returning();
  return folder;
}

export async function createFlashcard(
  folderId: string,
  cards: GeneratedFlashcard[]
) {
  await db.insert(flashcards).values(cards.map((c) => ({ ...c, folderId })));
}
