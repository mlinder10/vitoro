"use client";

import { cn } from "@/lib/utils";
import { NBMEQuestion, QuestionChoice, Task } from "@/types";
import { ArrowLeft, ArrowUp, Expand, Loader, Shrink } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import MessagesContainer from "./messages-container";
import useChatHistory from "@/hooks/use-chat-history";
import { getGeneralSystemPrompt, getTaskSystemPrompt } from "./prompts";

type ChatCardProps = {
  question: NBMEQuestion;
  choice: QuestionChoice | null;
  expanded?: boolean;
  fullScreen?: boolean;
  onToggleExpand?: () => void;
  onToggleFullScreen?: () => void;
};

export default function ChatCard({
  question,
  choice,
  expanded = false,
  fullScreen = false,
  onToggleExpand,
  onToggleFullScreen,
}: ChatCardProps) {
  const { messages, isLoading, chat, clearHistory } = useChatHistory();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  async function promptWithTask(task: Task) {
    if (!choice) return;

    const basePrompt = getTaskSystemPrompt(task, question, choice);
    await chat(undefined, basePrompt);
  }

  async function promptGeneral() {
    if (!choice || !inputRef.current) return;
    const inputValue = inputRef.current.value.trim();
    if (!inputValue) return;
    inputRef.current.value = "";

    const basePrompt = getGeneralSystemPrompt(question, choice);
    await chat(inputValue, basePrompt);
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

  useEffect(() => {
    clearHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {onToggleFullScreen && (
        <button
          className="top-4 right-4 absolute flex justify-center items-center backdrop-blur-md border rounded-full w-[32px] aspect-square cursor-pointer"
          onClick={onToggleFullScreen}
        >
          {fullScreen ? <Shrink size={16} /> : <Expand size={16} />}
        </button>
      )}
    </section>
  );
}
