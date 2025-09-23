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
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type ChatCardProps = {
  question: NBMEQuestion;
  choice: QuestionChoice | null;
  expanded?: boolean;
  fullScreen?: boolean;
  onToggleExpand?: () => void;
  onToggleFullScreen?: () => void;
};

// TODO: add loading indicator on flashcard generation
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
      <FlashcardForm
        open={cards.length > 0}
        setOpen={(open) => !open && setCards([])}
        flashcards={cards}
      />
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
  setOpen: (open: boolean) => void;
  flashcards: GeneratedFlashcard[];
};

function FlashcardForm({ open, setOpen, flashcards }: FlashcardFormProps) {
  const { id } = useSession();
  const [folders, setFolders] = useState<FlashcardFolder[]>([]);
  const [target, setTarget] = useState<FlashcardFolder | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchFolders(id).then(setFolders);
  }, [id]);

  async function handleCreateFolder() {
    if (!newFolderName.trim()) return;
    if (folders.some((f) => f.name === newFolderName.trim())) return;

    setLoading(true);
    const folder = await createFolder(newFolderName.trim(), id);
    setFolders((prev) => [...prev, folder]);
    setTarget(folder);
    setNewFolderName("");
    setLoading(false);
  }

  async function handleCreateFlashcard() {
    if (!target) return;
    setLoading(true);
    await createFlashcard(target.id, flashcards);
    setLoading(false);
    setOpen(false);
    toast.success(
      `Successfully saved ${flashcards.length} flashcards to ${target.name}`,
      { richColors: true }
    );
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent className="flex flex-col min-w-full min-h-full">
        <DialogHeader>
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogDescription>
            Choose or create a folder to save your flashcards
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 gap-6 overflow-hidden">
          <div className="flex flex-col pr-4 border-r w-1/3">
            <div className="flex gap-2 mb-4">
              <input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="New folder name"
                className="flex-1 px-2 py-1 border rounded-md text-sm"
              />
              <Button onClick={handleCreateFolder} disabled={loading}>
                Create
              </Button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto">
              {folders.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setTarget(f)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer",
                    target?.id === f.id
                      ? "border-custom-accent bg-secondary"
                      : "hover:bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "font-black text-muted-foreground",
                      target?.id === f.id && "text-custom-accent"
                    )}
                  >
                    •
                  </span>
                  <span
                    className={cn(
                      target?.id === f.id
                        ? "text-custom-accent"
                        : "text-muted-foreground"
                    )}
                  >
                    {f.name}
                  </span>
                </div>
              ))}
              {folders.length === 0 && (
                <p className="text-muted-foreground text-sm italic">
                  No folders yet
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="mb-2 font-semibold text-sm">Preview</h3>
            <div className="flex-1 space-y-3 p-3 border rounded-md overflow-y-auto">
              {flashcards.map((c, i) => (
                <div key={i} className="flex flex-col p-2 border rounded-md">
                  <ReactMarkdown>{c.front}</ReactMarkdown>
                  <div className="my-4 bg-border w-full h-px" />
                  <ReactMarkdown>{c.back}</ReactMarkdown>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="accent"
                onClick={handleCreateFlashcard}
                disabled={!target || loading}
              >
                Save to {target?.name ?? "Folder"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
