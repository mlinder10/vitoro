"use client";

import { cn } from "@/lib/utils";
import {
  FlashcardFolder,
  GeneratedFlashcard,
  NBMEQuestion,
  QuestionChoice,
  Task,
} from "@/types";
import {
  ArrowLeft,
  ArrowUp,
  Expand,
  Eye,
  Loader,
  Menu,
  Settings,
  Shrink,
  Sparkles,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MessagesContainer from "./messages/messages-container";
import useChatHistory from "@/hooks/use-chat-history";
import { getGeneralSystemPrompt, getTaskSystemPrompt } from "./actions/prompts";
import ChatSettings from "./chat-settings";
import {
  createFlashcard,
  createFolder,
  fetchFolders,
  generateFlashcard,
} from "./actions/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useSession } from "@/contexts/session-provider";

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
  const [cards, setCards] = useState<GeneratedFlashcard[]>([]);
  const [tone, setTone] = useState<string>("Clear and concise");
  const { messages, isLoading, chat, addMessage, clearHistory } =
    useChatHistory();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

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
    const cards = await generateFlashcard(question);
    setCards([cards.basic, cards.cloze]);
  }

  // --- Input Handlers ---

  function handleInput(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePromptGeneral();
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
      <FlashcardForm open={cards.length > 0} flashcards={cards} />
    </section>
  );
}

// --- Nav Buttons ---

type NavButtonsProps = {
  expanded: boolean;
  fullScreen: boolean;
  tone: string;
  onToggleExpand?: () => void;
  onToggleFullScreen?: () => void;
  onShowPromptOptions: () => void;
  onGenerateFlashcard: () => void;
  setTone: Dispatch<SetStateAction<string>>;
};

function NavButtons({
  expanded,
  fullScreen,
  tone,
  onToggleExpand,
  onToggleFullScreen,
  onShowPromptOptions,
  onGenerateFlashcard,
  setTone,
}: NavButtonsProps) {
  return (
    <>
      {/* Resize Buttons */}
      <div className="top-4 left-4 absolute flex gap-2">
        {onToggleExpand && (
          <button
            className="flex justify-center items-center backdrop-blur-md border rounded-full w-[32px] aspect-square cursor-pointer"
            onClick={onToggleExpand}
            aria-label="Toggle chat size"
          >
            <ArrowLeft
              size={16}
              className={cn("transition-all", expanded && "rotate-180")}
            />
          </button>
        )}
        {onToggleFullScreen && (
          <button
            className="flex justify-center items-center backdrop-blur-md border rounded-full w-[32px] aspect-square cursor-pointer"
            onClick={onToggleFullScreen}
            aria-label="Toggle chat fullscreen"
          >
            {fullScreen ? <Shrink size={16} /> : <Expand size={16} />}
          </button>
        )}
      </div>

      {/* Settins Buttons */}
      <div className="top-4 right-4 absolute flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="flex justify-center items-center backdrop-blur-md border rounded-full w-[32px] aspect-square cursor-pointer"
              aria-label="Open chat settings"
            >
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

        <Select value="none">
          <SelectTrigger
            className="backdrop-blur-md border rounded-2xl"
            aria-label="Open chat options"
          >
            <Menu size={16} className="text-foreground" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1" onMouseDown={onShowPromptOptions}>
              <Eye size={16} />
              <span>Show Prompt Options</span>
            </SelectItem>
            <SelectItem value="2" onMouseDown={onGenerateFlashcard}>
              <Sparkles size={16} />
              <span>Generate Flashcard</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
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

// --- Flashcard Saving ---

type FlashcardFormProps = {
  open: boolean;
  flashcards: GeneratedFlashcard[];
};

function FlashcardForm({ open, flashcards }: FlashcardFormProps) {
  const { id } = useSession();
  const [folders, setFolders] = useState<FlashcardFolder[]>([]);
  const [target, setTarget] = useState<FlashcardFolder | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFolders(id).then(setFolders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreateFolder() {
    if (!inputRef.current) return;
    const name = inputRef.current.value;
    if (folders.some((f) => f.name === name)) return;
    await createFolder(name, id);
  }

  async function handleCreateFlashcard() {
    if (!target) return;
    await createFlashcard(target.id, flashcards);
  }

  return (
    <Dialog open={open}>
      <DialogContent className="min-w-full min-h-full">
        <DialogHeader>
          <DialogTitle>Save Flashcard</DialogTitle>
          <DialogDescription>
            Choose a folder to save your flashcard to
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2">
          <div className="h-full overflow-y-auto">
            {folders.map((f) => (
              <div
                key={f.id}
                className="cursor-pointer"
                onClick={() => setTarget(f)}
              >
                {f.name}
              </div>
            ))}
          </div>
          <div>{/* TODO: flashcard preview + save buttons */}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
