"use client";

import { cn } from "@/lib/utils";
import { NBMEQuestion, QuestionChoice, Task } from "@/types";
import { ArrowLeft, ArrowUp, Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  promptChatWithTask,
  promptGeneralChat,
} from "@/app/(protected)/practice/chat";
import { Button } from "@/components/ui/button";
import MessagesContainer from "./messages-container";
import TutorResponse from "./tutor-response";

type ChatCardProps = {
  question: NBMEQuestion;
  choice: QuestionChoice | null;
  expanded?: boolean;
  onToggleExpand?: () => void;
};

export default function ChatCard({
  question,
  choice,
  expanded = false,
  onToggleExpand,
}: ChatCardProps) {
  const [messages, setMessages] = useState<
    {
      id: string;
      content: React.ReactNode;
      isUser: boolean;
      rawText?: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  async function promptWithTask(task: Task) {
    if (!choice) return;
    setIsLoading(true);

    try {
      let fullContent = "";
      const res = await promptChatWithTask(task, question, choice);

      // Collect all content first
      while (true) {
        const { value, done } = await res.next();
        if (done) break;
        fullContent += value;
      }

      // Add complete AI response with expandable sections
      const aiMessage = {
        id: crypto.randomUUID(),
        content: <TutorResponse content={fullContent} />,
        isUser: false,
        rawText: fullContent, // Store raw text for server-side context
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error in promptWithTask:", error);
      setIsLoading(false);
    }
  }

  async function promptGeneral() {
    if (!choice || !inputRef.current) return;
    const inputValue = inputRef.current.value.trim();
    if (!inputValue) return;

    setIsLoading(true);
    const userMessage = {
      id: crypto.randomUUID(),
      content: inputValue,
      isUser: true,
      rawText: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    inputRef.current.value = "";

    try {
      let fullContent = "";
      const serverMessages = [...messages, userMessage].map((msg) => ({
        role: msg.isUser ? ("user" as const) : ("assistant" as const),
        content:
          msg.rawText || (typeof msg.content === "string" ? msg.content : ""),
      }));

      const res = await promptGeneralChat(question, choice, serverMessages);

      while (true) {
        const { value, done } = await res.next();
        if (done) break;
        fullContent += value;
      }

      const aiMessage = {
        id: crypto.randomUUID(),
        content: <TutorResponse content={fullContent} />,
        isUser: false,
        rawText: fullContent,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error in promptGeneral:", error);
      setIsLoading(false);
    }
  }

  function handleInput(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      promptGeneral();
    }
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset messages when question/choice changes
  useEffect(() => {
    setMessages([]);
  }, [question.id, choice]);

  return (
    <section
      className={cn(
        expanded ? "flex-3" : "flex-1",
        "relative flex flex-col bg-tertiary border rounded-md h-full overflow-y-auto transition-all"
      )}
    >
      <MessagesContainer
        messages={messages}
        endRef={endRef}
        handlePromptWithTask={promptWithTask}
        isLoading={isLoading}
      />
      <div className="mx-4 mb-2 border-2 rounded-md">
        <textarea
          placeholder="Ask a question..."
          disabled={isLoading}
          className="p-2 border-none outline-none w-full font-sans resize-none"
          ref={inputRef}
          onKeyDown={(e) => handleInput(e)}
        />
        <div className="flex justify-end p-2">
          <Button
            variant="accent"
            size="icon"
            className="rounded-full"
            onClick={() => promptGeneral()}
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : <ArrowUp />}
          </Button>
        </div>
      </div>
      {onToggleExpand && (
        <button
          className="top-4 left-4 absolute flex justify-center items-center backdrop-blur-md border rounded-full w-[32px] aspect-square cursor-pointer"
          onClick={onToggleExpand}
        >
          <ArrowLeft
            size={16}
            className={cn("transition-all", expanded && "rotate-180")}
          />
        </button>
      )}
    </section>
  );
}
