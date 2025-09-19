"use server";

import { NBMEQuestion } from "@/types";
import { getFlashcardSystemPrompt } from "./prompts";
import { Gemini } from "@/ai";

export async function generateFlashcard(question: NBMEQuestion) {
  const flashcardPrompt = getFlashcardSystemPrompt(question);

  const llm = new Gemini();
  const flashcard = await llm.prompt([
    { role: "user", content: flashcardPrompt, type: "text" },
  ]);
  return flashcard;
}
