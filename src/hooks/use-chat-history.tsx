"use client";

import { Prompt } from "@/ai";
import { useState } from "react";
import { chatWrapper } from "./chat-actions";
import { Message } from "@/types";

const CONVERSATION_LENGTH = 10;
const MAX_WORD_COUNT = 500;
const MAX_INPUT_WORD_COUNT = 500;

export default function useChatHistory(basePrompt?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizedOn, setSummarizedOn] = useState<number>(0);

  async function chat(message: string, base: string | undefined = basePrompt) {
    const wordCount = message.split(" ").length;
    if (wordCount > MAX_INPUT_WORD_COUNT) {
      throw new Error(`Message too long: ${wordCount} words`);
    }

    const newMessages: Message[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content: message, type: "text" },
    ];
    setMessages(newMessages);

    setIsLoading(true);

    const prompts: Prompt[] = [];

    if (base) {
      prompts.push({
        role: "user",
        content: base,
        type: "text",
      });
    }

    if (summary) {
      prompts.push({
        role: "user",
        content: `Previous summary: ${summary}`,
        type: "text",
      });
    }

    prompts.push(
      ...newMessages.slice(summarizedOn).map((m) => ({
        role: m.role,
        content: m.content as string,
        type: "text" as const,
      }))
    );

    const output = await chatWrapper(prompts);

    newMessages.push({
      id: crypto.randomUUID(),
      role: "assistant",
      content: output,
      type: "text",
    });
    setMessages(newMessages);
    setIsLoading(false);

    if (newMessages.length - summarizedOn > CONVERSATION_LENGTH) {
      await summarizeChat();
    }
  }

  async function summarizeChat() {
    const prompts: Prompt[] = messages.slice(summarizedOn).map((m) => ({
      role: m.role,
      content: m.content as string,
      type: "text" as const,
    }));

    if (summary) {
      prompts.push({
        role: "user",
        content: `Previous summary: ${summary}`,
        type: "text",
      });
    }

    prompts.push({
      role: "user",
      content: `Summarize this conversation. Try to use at most ${MAX_WORD_COUNT} words`,
      type: "text",
    });

    const newSummary = await chatWrapper(prompts);
    setSummary(newSummary);
    setSummarizedOn(messages.length);
  }

  function clearHistory() {
    setMessages([]);
    setSummary(null);
    setSummarizedOn(0);
  }

  return { messages, isLoading, chat, clearHistory };
}
