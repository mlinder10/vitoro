"use client";

import { Prompt } from "@/ai";
import { useState } from "react";
import { chatWrapper } from "./chat-actions";
import { Message } from "@/types";

const SHORT_TERM_MESSAGES_LENGTH = 10;
const SUMMARY_MAX_WORD_COUNT = 500;
const MAX_MESSAGE_WORD_COUNT = 500;

type Config = {
  basePrompt?: string;
  shortTermMessagesLength: number;
  summaryMaxWordCount: number;
  maxMessageWordCount: number;
};

const DEFAULT_CONFIG = {
  shortTermMessagesLength: SHORT_TERM_MESSAGES_LENGTH,
  summaryMaxWordCount: SUMMARY_MAX_WORD_COUNT,
  maxMessageWordCount: MAX_MESSAGE_WORD_COUNT,
};

export default function useChatHistory(config: Config = DEFAULT_CONFIG) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizedOn, setSummarizedOn] = useState<number>(0);

  async function chat(
    message: string | undefined,
    base: string | undefined = config.basePrompt
  ) {
    if (isLoading) {
      throw new Error("Already generating response");
    }

    const wordCount = message?.trim().split(/\s+/).length ?? 0;
    if (wordCount > config.maxMessageWordCount) {
      throw new Error(`Message too long: ${wordCount} words`);
    }

    const newMessages: Message[] = [...messages];
    if (message !== undefined) {
      newMessages.push({
        id: crypto.randomUUID(),
        role: "user",
        content: message,
        type: "text",
      });
    }

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

    try {
      const output = await chatWrapper(prompts);
      newMessages.push({
        id: crypto.randomUUID(),
        role: "assistant",
        content: output,
        type: "text",
      });
    } catch (err) {
      console.error(err);
      newMessages.push({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Failed to generate response",
        type: "text",
      });
    } finally {
      setIsLoading(false);
      setMessages(newMessages);
    }

    if (newMessages.length - summarizedOn > config.shortTermMessagesLength) {
      void summarizeChat(newMessages);
    }
  }

  async function summarizeChat(messages: Message[]) {
    const prompts: Prompt[] = [];

    if (summary) {
      prompts.push({
        role: "user",
        content: `Previous summary: ${summary}`,
        type: "text",
      });
    }

    prompts.push(
      ...messages.slice(summarizedOn).map((m) => ({
        role: m.role,
        content: m.content as string,
        type: "text" as const,
      }))
    );

    prompts.push({
      role: "user",
      content: `Summarize this conversation. Try to use at most ${config.summaryMaxWordCount} words`,
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
