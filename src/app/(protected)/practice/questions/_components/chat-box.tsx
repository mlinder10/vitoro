import React, { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Question, QuestionChoice } from "@/types";
import { ArrowLeft, ArrowUp, BotIcon, Loader } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { useSession } from "@/contexts/session-provider";
import { toast } from "sonner";
import { ChatStep, MessageTag, promptChat } from "../../chat-kaleb";
import { createReviewQuestion } from "../../actions";

// Strongly-typed chat message used only in this component
export type ChatMsg = {
  role: "user" | "assistant";
  content: string;
  tags?: MessageTag[];
};

type ChatboxProps = {
  question: Question;
  answer: QuestionChoice | null;
};

export default function ChatBox({ question, answer }: ChatboxProps) {
  const { id } = useSession();

  const [isExpanded, setIsExpanded] = useState(false);
  const [nextTags, setNextTags] = useState<MessageTag[]>([]);
  const [step, setStep] = useState<ChatStep>(
    answer && question?.answer && (answer as any)?.id === (question.answer as any)?.id
      ? "correct-1"
      : "incorrect-1"
  );

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------------------- Prompting --------------------------------

  async function handlePrompt(explicit?: string) {
    if (isLoading) return; // guard against overlaps
    if (!answer) return;

    const value = (explicit ?? inputRef.current?.value ?? "").trim();
    if (!value) return;

    // Clear input eagerly for snappy UX
    if (inputRef.current) inputRef.current.value = "";

    const userMsg: ChatMsg = { role: "user", content: value, tags: nextTags };
    setMessages((prev) => [...prev, userMsg]);
    setNextTags([]);
    setIsLoading(true);

    try {
      const res = await promptChat(question, answer, [...messages, userMsg] as any, step);

      // Prepare an empty assistant message so we can stream into it
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", tags: res?.prompt?.tags ?? [] },
      ]);

      // Expose next suggested tags for the next user turn
      if (res?.prompt?.nextTags) setNextTags(res.prompt.nextTags);

      // Prefer async iteration; if not available, fall back to manual next()
      const stream: any = res?.stream;

      if (stream && Symbol.asyncIterator in Object(stream)) {
        for await (const token of stream as AsyncIterable<string>) {
          if (!mountedRef.current) break;
          appendToLastAssistant(token ?? "");
        }
      } else if (stream?.next) {
        while (true) {
          const { value, done } = await stream.next();
          if (done) break;
          if (!mountedRef.current) break;
          appendToLastAssistant(value ?? "");
        }
      }

      // Advance step at the end
      if (res?.prompt?.next) setStep(res.prompt.next as ChatStep);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while chatting.", { richColors: true });
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }

  function appendToLastAssistant(token: string) {
    setMessages((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      if (last.role !== "assistant") return prev; // safety
      const updated = { ...last, content: last.content + token };
      return [...prev.slice(0, -1), updated];
    });
  }

  // -------------------------------- Actions ----------------------------------

  async function handleCreateReview() {
    if (!answer) return;
    try {
      await createReviewQuestion(question, answer, id);
      toast.success("Review question created", { richColors: true });
    } catch (err: any) {
      console.error(err);
      toast.error(
        `Failed to create review question${err?.message ? ": " + err.message : ""}`,
        { richColors: true }
      );
    }
  }

  // -------------------------------- Render -----------------------------------

  // Don’t hard-hide the box on completion; show a completion card instead
  const isComplete = step === "incorrect-complete" || step === "correct-complete";

  return (
    <section
      className={cn(
        "relative flex flex-col flex-1 bg-background border-2 rounded-md transition-all",
        isExpanded && "md:basis-2/3"
      )}
    >
      <div className="flex-1 min-h-0 flex flex-col">
        <MessagesContainer
          messages={messages}
          isCorrect={Boolean(answer && question?.answer && (answer as any)?.id === (question.answer as any)?.id)}
          endRef={endRef}
          handlePrompt={handlePrompt}
          isComplete={isComplete}
          onRestart={() => {
            setMessages([]);
            setStep(
              answer && question?.answer && (answer as any)?.id === (question.answer as any)?.id
                ? "correct-1"
                : "incorrect-1"
            );
          }}
        />

        {/* Input area is always visible */}
        <div className="mx-4 mb-2 border-2 rounded-md">
          <textarea
            placeholder="Ask a question…"
            disabled={isLoading}
            className="p-2 border-none outline-none w-full font-sans resize-none"
            ref={inputRef}
            rows={3}
            onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handlePrompt();
              }
            }}
          />
          <div className="flex items-center justify-between p-2 text-xs text-muted-foreground">
            <span>Enter to send • Shift+Enter for a newline</span>
            <Button
              variant="accent-tertiary"
              size="icon"
              className="rounded-full transition"
              onClick={() => handlePrompt()}
              disabled={isLoading || !answer}
              aria-label="Send"
            >
              {isLoading ? <Loader className="animate-spin" /> : <ArrowUp />}
            </Button>
          </div>
        </div>

        <div className="mx-4 mb-4 p-2 border-2 rounded-md">
          <div className="flex flex-wrap gap-2">
            <ActionButton label="Create Review Question" onClick={handleCreateReview} />
          </div>
        </div>
      </div>

      <button
        className="top-4 left-4 absolute flex justify-center items-center backdrop-blur-md border rounded-full w-[32px] aspect-square cursor-pointer"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-label={isExpanded ? "Collapse" : "Expand"}
      >
        <ArrowLeft size={16} className={cn("transition-transform", isExpanded && "rotate-180")} />
      </button>
    </section>
  );
}

type MessagesContainerProps = {
  messages: ChatMsg[];
  isCorrect: boolean;
  endRef: RefObject<HTMLDivElement | null>;
  handlePrompt: (prompt?: string) => void;
  isComplete: boolean;
  onRestart: () => void;
};

function MessagesContainer({ messages, isCorrect, endRef, handlePrompt, isComplete, onRestart }: MessagesContainerProps) {
  const showEmpty = messages.length === 0;

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {showEmpty && (
        <div className="flex-1 place-items-center grid">
          <div className="flex flex-col items-center gap-2 text-sm">
            <BotIcon size={32} className="font-bold text-muted-foreground" />
            <p className="text-muted-foreground text-lg">I&apos;m here to help!</p>
            <div className="gap-2 space-y-2 mt-4 px-4 max-w-prose">
              <p className="text-muted-foreground">Try asking:</p>
              {isCorrect ? (
                <RecommendedPrompt
                  prompt={`I'm still unsure. Can you help me understand the concept better?`}
                  onClick={handlePrompt}
                />
              ) : (
                <RecommendedPrompt
                  prompt={`Can you help me understand where I went wrong?`}
                  onClick={handlePrompt}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((m, index) =>
        m.role === "user" ? (
          <div key={index} className="bg-secondary my-2 ml-auto p-2 rounded-md w-fit max-w-[87.5%]">
            {m.content}
          </div>
        ) : (
          <div key={index} className="prose prose-sm dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {m.content}
            </ReactMarkdown>
          </div>
        )
      )}

      {/* Completion card (only if we’ve had some messages) */}
      {isComplete && messages.length > 0 && (
        <div className="mt-4 border rounded-md p-4 bg-muted/30">
          <p className="font-medium">Session complete</p>
          <p className="text-sm text-muted-foreground mt-1">
            You can review the conversation, create a review question, or restart.
          </p>
          <div className="flex gap-2 mt-3">
            <Button variant="secondary" onClick={onRestart}>Restart</Button>
            <Button variant="outline" onClick={() => handlePrompt("Summarize what we covered.")}>Summarize</Button>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}

type RecommendedPromptProps = {
  prompt: string;
  onClick: (prompt: string) => void;
};

function RecommendedPrompt({ prompt, onClick }: RecommendedPromptProps) {
  return (
    <button
      type="button"
      className="bg-muted hover:bg-muted/50 px-3 py-2 rounded transition cursor-pointer"
      onClick={() => onClick(prompt)}
    >
      <span className="mr-1">👉</span> “{prompt}”
    </button>
  );
}

type ActionButtonProps = {
  label: string;
  onClick: () => Promise<void> | void;
};

function ActionButton({ label, onClick }: ActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    try {
      setIsLoading(true);
      await onClick();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "px-2 py-1 bg-border rounded-md text-sm transition",
        isLoading ? "text-muted-foreground opacity-70" : "hover:bg-border/80"
      )}
    >
      {label}
    </button>
  );
}

