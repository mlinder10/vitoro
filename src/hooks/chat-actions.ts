"use server";

import { Gemini, Prompt } from "@/ai";

export async function chatWrapper(prompt: Prompt[]) {
  const llm = new Gemini();
  return await llm.prompt(prompt, false);
}
