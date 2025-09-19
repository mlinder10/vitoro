"use client";

import { cn } from "@/lib/utils";
import { NBMEQuestion, QuestionChoice, Task, TASKS } from "@/types";
import { ArrowLeft, ArrowUp, Expand, Loader, Settings, Shrink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MessagesContainer from "./messages-container";
import useChatHistory from "@/hooks/use-chat-history";
import { getGeneralSystemPrompt, getTaskSystemPrompt } from "./prompts";
import ChatSettings from "./chat-settings";

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
  const [tone, setTone] = useState<string>("Clear and concise");
  const { messages, isLoading, chatStreamed, clearHistory, addMessage } = useChatHistory();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  async function promptWithTask(task: Task) {
    if (!choice) return;

    const basePrompt = getTaskSystemPrompt(task, question, choice, tone);
    await chatStreamed(undefined, basePrompt);
  }

  async function promptGeneral() {
    if (!choice || !inputRef.current) return;
    const inputValue = inputRef.current.value.trim();
    if (!inputValue) return;
    inputRef.current.value = "";

    const basePrompt = getGeneralSystemPrompt(question, choice, tone);
    await chatStreamed(inputValue, basePrompt);
  }

  function handleInput(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      promptGeneral();
    }
  }

  function showPromptOptions() {
    if (!choice) return;

    // Directly add an assistant message that triggers the TaskPrompt display
    const optionsMessage = {
      id: crypto.randomUUID(),
      role: "assistant" as const,
      content: "**Try a different approach:**\n\nChoose one of the options below to analyze this question from a different angle.",
      type: "text" as const,
    };

    addMessage(optionsMessage);
  }

  async function makeFlashcard() {
    if (!choice) return;

    // Create flashcard generation prompt
    const flashcardPrompt = `You are a medical education expert. Create high-yield flashcards based on key concept from this board question. The **back:** should include supplementary material related to the topic that helps provide more context for the student to review.

Question:
${question.question}

Correct Answer: ${question.answer}
Correct Answer Text: ${question.choices[question.answer]}

Instructions:
1. Identify the key concept being tested
2. Create exactly 2 flashcards formatted for Anki import
3. Include supplementary context and high-yield details
4. Use clear, concise language suitable for spaced repetition
5. Format for readability:
   - Use bullet points for lists
   - Bold key terms and concepts
   - Use → for cause/effect relationships
   - Include relevant mnemonics or memory aids when helpful
   - Keep front cards concise, back cards comprehensive

Respond with exactly this format:

## 🃏 Anki Flashcards

### Basic Q&A Card
**Front:** [Focused question about the key concept]

**Back:** [Answer with supplementary context, mechanisms, and high-yield details that help reinforce understanding]

---

### Cloze Deletion Card
**Front:** [Clinical statement with {{c1::key term}} cloze deletion format]

**Back:** [Additional context and clinical pearls related to the cloze term]

---

### Study Notes
**Key Concept:** [High-yield concept being tested]
**Clinical Pearl:** [Memorable clinical insight or teaching point]`;

    // Send flashcard generation request (independent of chat history)
    await chatStreamed(undefined, flashcardPrompt);
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
        <div className="flex justify-between items-center p-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => showPromptOptions()}
              disabled={isLoading}
            >
              Show Options
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => makeFlashcard()}
              disabled={isLoading}
            >
              Make Flashcard
            </Button>
          </div>
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
          onClick={() => {
            onToggleExpand();
            // If fullscreen is active, also toggle it off when collapsing
            if (fullScreen && onToggleFullScreen) {
              onToggleFullScreen();
            }
          }}
        >
          <ArrowLeft
            size={16}
            className={cn("transition-all", expanded && "rotate-180")}
          />
        </button>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <button className="top-4 right-12 absolute flex justify-center items-center backdrop-blur-md border rounded-full w-[32px] aspect-square cursor-pointer">
            <Settings size={16} />
          </button>
        </DialogTrigger>
        <DialogContent className="min-w-fit">
          <DialogHeader>
            <DialogTitle>Chat Settings</DialogTitle>
          </DialogHeader>
          <ChatSettings tone={tone} setTone={setTone} />
        </DialogContent>
      </Dialog>
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
