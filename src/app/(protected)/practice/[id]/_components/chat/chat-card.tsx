"use client";

import { cn } from "@/lib/utils";
import {
  GeneratedFlashcard,
  NBMEQuestion,
  QuestionChoice,
  Task,
} from "@/types";
import { ArrowUp, Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import MessagesContainer from "./messages/messages-container";
import useChatHistory from "@/hooks/use-chat-history";
import { getGeneralSystemPrompt, getTaskSystemPrompt } from "./actions/prompts";
import { generateFlashcard } from "./actions/actions";
import FlashcardForm from "./flashcard-form";
import NavButtons from "./nav-buttons";
import { toast } from "sonner";

type ChatCardProps = {
  question: NBMEQuestion;
  choice: QuestionChoice | null;
  expanded: boolean;
  fullScreen: boolean;
  onToggleExpand: () => void;
  onToggleFullScreen: () => void;
};

export default function ChatCard({
  question,
  choice,
  expanded = false,
  fullScreen = false,
  onToggleExpand,
  onToggleFullScreen,
}: ChatCardProps) {
  const [cards, setCards] = useState<GeneratedFlashcard[]>([]);
  const [tone, setTone] = useState<string>("Clear and concise");
  const { messages, isLoading, setIsLoading, chat, addMessage, clearHistory } =
    useChatHistory();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    clearHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, choice]);

  // --- AI Functions ---

  async function handlePromptWithTask(task: Task) {
    if (!choice) return;

    const basePrompt = getTaskSystemPrompt(task, question, choice, tone);
    await chat(undefined, { basePrompt, useHistory: false });
  }

  async function handlePromptGeneral() {
    if (!choice || !inputRef.current) return;
    const inputValue = inputRef.current.value.trim();
    if (!inputValue) return;
    inputRef.current.value = "";

    const basePrompt = getGeneralSystemPrompt(question, choice, tone);
    await chat(inputValue, { basePrompt });
  }

  async function handleGenerateFlashcard() {
    try {
      setIsLoading(true);
      const c = await generateFlashcard(question);
      setCards([c.basic, c.cloze]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate flashcard", { richColors: true });
    } finally {
      setIsLoading(false);
    }
  }

  function showPromptOptions() {
    if (!choice) return;

    // Directly add an assistant message that triggers the TaskPrompt display
    const optionsMessage = {
      id: crypto.randomUUID(),
      role: "assistant" as const,
      content:
        "**Try a different approach:**\n\nChoose one of the options below to analyze this question from a different angle.",
      type: "text" as const,
    };

    addMessage(optionsMessage);
  }

  // --- Input Handlers ---

  function handleInput(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePromptGeneral();
    }
  }

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
        handlePromptWithTask={handlePromptWithTask}
        isLoading={isLoading}
      />
      <ChatInput
        isLoading={isLoading}
        inputRef={inputRef}
        handleInput={handleInput}
        handlePromptGeneral={handlePromptGeneral}
      />

      {/* Absolutely positioned */}
      <NavButtons
        expanded={expanded}
        fullScreen={fullScreen}
        tone={tone}
        onToggleExpand={onToggleExpand}
        onToggleFullScreen={onToggleFullScreen}
        onShowPromptOptions={showPromptOptions}
        onGenerateFlashcard={handleGenerateFlashcard}
        setTone={setTone}
      />

      {/* Dialog */}
      <FlashcardForm
        open={cards.length > 0}
        setOpen={(open) => !open && setCards([])}
        flashcards={cards}
      />
    </section>
  );
}

// --- Chat Input ---

type ChatInputProps = {
  isLoading: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  handleInput: (e: React.KeyboardEvent) => void;
  handlePromptGeneral: () => void;
};

function ChatInput({
  isLoading,
  inputRef,
  handleInput,
  handlePromptGeneral,
}: ChatInputProps) {
  return (
    <div className="mx-4 mb-2 border-2 rounded-md">
      <textarea
        placeholder="Ask a question..."
        disabled={isLoading}
        className="p-2 border-none outline-none w-full font-sans resize-none"
        ref={inputRef}
        onKeyDown={(e) => handleInput(e)}
      />
      <div className="flex justify-end items-center p-2">
        <Button
          variant="accent"
          size="icon"
          className="rounded-full"
          onClick={handlePromptGeneral}
          disabled={isLoading}
          aria-label="Send prompt"
        >
          {isLoading ? <Loader className="animate-spin" /> : <ArrowUp />}
        </Button>
      </div>
    </div>
  );
}
