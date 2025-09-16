"use client";

import { useRef, useState } from "react";
import { Prompt } from "@/ai";
import { chatStreamWrapper, chatWrapper } from "./chat-actions";
import { Message } from "@/types";
import { stripAndParse } from "@/lib/utils";

const SHORT_TERM_MESSAGES_LENGTH = 4;
const SUMMARY_MAX_TOKEN_COUNT = 1000;
const MAX_MESSAGE_WORD_COUNT = 500;
const MAX_CONTEXT_MESSAGES = 50;

type Config = {
  basePrompt?: string;
  shortTermMessagesLength?: number;
  summaryMaxTokenCount?: number;
  maxMessageWordCount?: number;
};

type Summary = {
  topics: string[];
  userGoals: string[];
  assistantResponses: string[];
  entities: string[];
  openQuestions: string[];
};

export default function useChatHistory({
  basePrompt,
  shortTermMessagesLength = SHORT_TERM_MESSAGES_LENGTH,
  summaryMaxTokenCount = SUMMARY_MAX_TOKEN_COUNT,
  maxMessageWordCount = MAX_MESSAGE_WORD_COUNT,
}: Config = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [summarizedOn, setSummarizedOn] = useState<number>(0);
  const isLoadingRef = useRef(false);

  // --- Core functions ---

  async function chat(
    message: string | undefined,
    base: string | undefined = basePrompt
  ) {
    if (isLoadingRef.current) throw new Error("Already generating response");

    const { prompts, newMessages } = buildPrompts(
      messages,
      summary,
      summarizedOn,
      maxMessageWordCount,
      message,
      base
    );
    setMessages(newMessages);

    try {
      isLoadingRef.current = true;
      setIsLoading(true);

      const output = await chatWrapper(prompts);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: output,
        type: "text",
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Failed to generate response",
          type: "text",
        },
      ]);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }

    maybeSummarize(newMessages);
  }

  async function chatStreamed(
    message: string | undefined,
    base: string | undefined = basePrompt
  ) {
    if (isLoadingRef.current) throw new Error("Already generating response");

    const { prompts, newMessages } = buildPrompts(
      messages,
      summary,
      summarizedOn,
      maxMessageWordCount,
      message,
      base
    );
    setMessages(newMessages);

    try {
      isLoadingRef.current = true;
      setIsLoading(true);

      const stream = await chatStreamWrapper(prompts);
      let builtMessages = [...newMessages];

      let buffer = "";
      const flushBuffer = () => {
        if (!buffer) return;
        const lastMessage = builtMessages.at(-1);
        if (lastMessage?.role === "assistant") {
          builtMessages = [
            ...builtMessages.slice(0, -1),
            { ...lastMessage, content: lastMessage.content + buffer },
          ];
        } else {
          builtMessages = [
            ...builtMessages,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: buffer,
              type: "text",
            },
          ];
        }
        buffer = "";
        setMessages(builtMessages);
      };

      while (true) {
        const { value, done } = await stream.next();
        if (done) break;
        buffer += value;
        requestAnimationFrame(flushBuffer);
      }

      flushBuffer();
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Failed to generate response",
          type: "text",
        },
      ]);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }

    maybeSummarize(newMessages);
  }

  async function summarizeChat(msgs: Message[]) {
    const prompts: Prompt[] = [
      {
        role: "user",
        type: "text",
        content: `You are a conversation summarizer. Summarize the following chat into a compact JSON object.

RULES
- Be objective and concise.
- Max output token count: ${summaryMaxTokenCount}
- Only include information present in the conversation. No speculation.
- Try to merge information from the previous summary if possible.
- If you cannot do this, respond with a string explaining why.

OUTPUT FORMAT (STRICT JSON)
{
  "topics": [ "main subject A", "main subject B", "etc." ],
  "userGoals": [ "goal1", "goal2", "etc." ],
  "assistantResponses": [ "short description of helpful answers" ],
  "entities": [ "tools, APIs, people, or concepts mentioned" ],
  "openQuestions": [ "things user asked but not fully resolved" ]
}

PREVIOUS SUMMARY:

${JSON.stringify(summary)}

CONVERSATION TO SUMMARIZE:

${msgs
  .slice(summarizedOn)
  .map((m) => JSON.stringify({ role: m.role, content: m.content }))
  .join("\n\n")}
`,
      },
    ];

    try {
      const newSummary = await chatWrapper(prompts);
      const parsedSummary = stripAndParse<Summary>(newSummary);

      if (parsedSummary) {
        setSummary(parsedSummary);
        setSummarizedOn(msgs.length - 1);
      } else {
        console.warn("Failed to parse summary:", newSummary);
      }
    } catch (err) {
      console.error("Summarize error:", err);
    }
  }

  function maybeSummarize(newMessages: Message[]) {
    if (newMessages.length - summarizedOn > shortTermMessagesLength) {
      void summarizeChat(newMessages);
    }
  }

  function clearHistory() {
    setMessages([]);
    setSummary(null);
    setSummarizedOn(0);
  }

  return {
    messages,
    isLoading,
    summary,
    chat,
    chatStreamed,
    clearHistory,
  };
}

// --- Helpers ---

function buildPrompts(
  currentMessages: Message[],
  summary: Summary | null,
  summarizedOn: number,
  maxMessageWordCount: number,
  message: string | undefined,
  base?: string
): { prompts: Prompt[]; newMessages: Message[] } {
  const wordCount = message?.trim().split(/\s+/).length ?? 0;
  if (wordCount > maxMessageWordCount) {
    throw new Error(`Message too long: ${wordCount} words`);
  }

  let newMessages: Message[] = message
    ? [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "user",
          content: message,
          type: "text",
        },
      ]
    : currentMessages;

  if (newMessages.length > MAX_CONTEXT_MESSAGES) {
    newMessages = newMessages.slice(-MAX_CONTEXT_MESSAGES);
  }

  const prompts: Prompt[] = [];
  if (base) {
    prompts.push({ role: "user", content: base, type: "text" });
  }
  if (summary) {
    prompts.push({
      role: "user",
      content: `Previous summary: ${JSON.stringify(summary)}`,
      type: "text",
    });
  }
  prompts.push(
    ...newMessages.slice(summarizedOn).map((m) => ({
      role: m.role,
      content: m.content,
      type: "text" as const,
    }))
  );

  return { prompts, newMessages };
}
