"use client";

import { useRef, useState } from "react";
import { LLMOutput, Prompt } from "@/ai";
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
  chatFnc?: (prompts: Prompt[]) => Promise<LLMOutput>;
  chatStreamFnc?: (prompts: Prompt[]) => AsyncGenerator<LLMOutput>;
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
  chatFnc = chatWrapperWithFetch,
  chatStreamFnc = chatStreamWrapperWithFetch,
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

      const output = await chatFnc(prompts);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: output.text,
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

      const stream = await chatStreamFnc(prompts);
      let completeResponse = "";

      while (true) {
        const { value, done } = await stream.next();
        if (done) break;
        completeResponse += value.text;
      }

      // Create final assistant message with complete response
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: completeResponse,
        type: "text",
      };

      setMessages([...newMessages, assistantMessage]);
      
      // Turn off loading after setting final message
      isLoadingRef.current = false;
      setIsLoading(false);
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
      const newSummary = await chatFnc(prompts);
      const parsedSummary = stripAndParse<Summary>(newSummary.text);

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

  function addMessage(message: Message) {
    setMessages(prev => [...prev, message]);
  }

  return {
    messages,
    isLoading,
    summary,
    chat,
    chatStreamed,
    clearHistory,
    addMessage,
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
  
  // If this is a system prompt without user message (like task prompts), 
  // send only the base prompt like initial conversation
  if (base && !message) {
    prompts.push({ role: "user", content: base, type: "text" });
  } else {
    // Normal conversation flow with context
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
  }

  return { prompts, newMessages };
}

// --- Fetch ---

export async function chatWrapperWithFetch(
  prompts: Prompt[]
): Promise<LLMOutput> {
  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ prompts }),
  });
  return await res.json();
}

export async function* chatStreamWrapperWithFetch(prompts: Prompt[]) {
  const res = await fetch("/api/chat/stream", {
    method: "POST",
    body: JSON.stringify({ prompts }),
  });
  const stream = res.body?.getReader();
  if (!stream) return;
  const decoder = new TextDecoder();
  let buffer = "";
  
  // Helper function to extract JSON objects from a string
  const parseJsonObjects = (text: string): { objects: any[], remaining: string } => {
    const objects = [];
    let remaining = text;
    let braceCount = 0;
    let start = 0;
    let inString = false;
    let escaped = false;
    
    for (let i = 0; i < remaining.length; i++) {
      const char = remaining[i];
      
      if (escaped) {
        escaped = false;
        continue;
      }
      
      if (char === '\\' && inString) {
        escaped = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{') {
          if (braceCount === 0) start = i;
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            // Found complete JSON object
            const jsonStr = remaining.slice(start, i + 1);
            try {
              const obj = JSON.parse(jsonStr);
              objects.push(obj);
            } catch (e) {
              console.warn("Failed to parse JSON object:", jsonStr);
            }
          }
        }
      }
    }
    
    // Return remaining text (incomplete JSON if any)
    const lastCompleteIndex = braceCount === 0 ? remaining.length : start;
    return {
      objects,
      remaining: braceCount > 0 ? remaining.slice(start) : ""
    };
  };
  
  while (true) {
    const { done, value } = await stream.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    
    const { objects, remaining } = parseJsonObjects(buffer);
    buffer = remaining;
    
    for (const obj of objects) {
      yield obj;
    }
  }
  
  // Process any remaining data in buffer
  if (buffer.trim()) {
    const { objects } = parseJsonObjects(buffer);
    for (const obj of objects) {
      yield obj;
    }
  }
}
