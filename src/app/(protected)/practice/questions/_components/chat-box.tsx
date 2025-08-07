import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Question, QuestionChoice } from "@/types";
import { ArrowLeft, ArrowUp, BotIcon, Loader } from "lucide-react";
import { RefObject, useEffect, useRef, useState } from "react";
import { createReviewQuestion } from "../../actions";
import ReactMarkdown from "react-markdown";
import { KeyboardEvent } from "react";
import { useSession } from "@/contexts/session-provider";
import { toast } from "sonner";
import { ChatStep, Message, MessageTag, promptChat } from "../../chat-kaleb";

type ChatboxProps = {
  question: Question;
  answer: QuestionChoice | null;
};

export default function ChatBox({ question, answer }: ChatboxProps) {
  const { id } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [nextTags, setNextTags] = useState<MessageTag[]>([]);
  const [step, setStep] = useState<ChatStep>(
    question.answer === answer ? "correct-1" : "incorrect-1"
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Prompting ----------------------------------------------------------------

  async function handlePrompt(prompt?: string) {
    if (!prompt) prompt = inputRef.current?.value;
    if (!prompt || !answer) return;
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: prompt, tags: nextTags },
    ];
    setNextTags([]);
    if (inputRef.current) inputRef.current.value = "";
    setMessages(newMessages);
    setIsLoading(true);
    // this must be awaited, I'm not sure why the editor says that await has no effect
    const res = await promptChat(question, answer, newMessages, step);
    setNextTags(res.prompt.nextTags);
    while (true) {
      const { value, done } = await res.stream.next();
      if (done) break;
      streamCompletionHandler(value, res.prompt.tags);
    }
    setStep(res.prompt.next);
    setIsLoading(false);
  }

  function streamCompletionHandler(token: string, tags: MessageTag[]) {
    setMessages((prev) => {
      if (prev.length % 2 === 1)
        return [...prev, { role: "assistant", content: token, tags }];
      const last = prev[prev.length - 1];
      return [...prev.slice(0, -1), { ...last, content: last.content + token }];
    });
  }

  function handleInput(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePrompt();
    }
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Buttons ------------------------------------------------------------------

  async function handleCreateReview() {
    if (!answer) return;
    try {
      await createReviewQuestion(question, answer, id);
      toast.success("Review question created", { richColors: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create review question", { richColors: true });
    } finally {
    }
  }

  // Rendering ----------------------------------------------------------------

  if (!answer || step === "incorrect-complete" || step === "correct-complete")
    return null;

  return (
    <section
      className={cn(
        "relative flex flex-col flex-1 bg-background border-2 rounded-md transition-all",
        isExpanded && "flex-3"
      )}
    >
      <MessagesContainer
        messages={messages.map((m) => m.content)}
        isCorrect={answer === question.answer}
        endRef={endRef}
        handlePrompt={handlePrompt}
      />
      {messages.length > 0 ? (
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
              variant="accent-tertiary"
              size="icon"
              className="rounded-full"
              onClick={() => handlePrompt()}
              disabled={isLoading}
            >
              {isLoading ? <Loader className="animate-spin" /> : <ArrowUp />}
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="mx-4 mb-4 p-2 border-2 rounded-md">
        <div className="flex flex-wrap gap-2">
          <ActionButton
            label="Create Review Question"
            onClick={handleCreateReview}
          />
        </div>
      </div>
      <button
        className="top-4 left-4 absolute flex justify-center items-center backdrop-blur-md border rounded-full w-[32px] aspect-square cursor-pointer"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <ArrowLeft
          size={16}
          className={cn(isExpanded && "rotate-180 transition-all")}
        />
      </button>
    </section>
  );
}

type MessagesContainerProps = {
  messages: string[];
  isCorrect: boolean;
  endRef: RefObject<HTMLDivElement | null>;
  handlePrompt: (prompt?: string) => void;
};

function MessagesContainer({
  messages,
  isCorrect,
  endRef,
  handlePrompt,
}: MessagesContainerProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 place-items-center grid">
        <div className="flex flex-col items-center gap-2 text-sm">
          <BotIcon size={32} className="font-bold text-muted-foreground" />
          <p className="text-muted-foreground text-lg">
            I&apos;m here to help!
          </p>
          <div className="gap-2 space-y-2 mt-4 px-4">
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
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message, index) =>
        index % 2 === 0 ? (
          <div
            key={index}
            className="bg-secondary my-2 ml-auto p-2 rounded-md w-fit max-w-7/8"
          >
            {message}
          </div>
        ) : (
          <ReactMarkdown key={index}>{message}</ReactMarkdown>
        )
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
    <div
      className="bg-muted hover:bg-muted/50 px-3 py-2 rounded transition cursor-pointer"
      onClick={() => onClick(prompt)}
    >
      👉 “{prompt}”
    </div>
  );
}

type ActionButtonProps = {
  label: string;
  onClick: () => Promise<void>;
};

function ActionButton({ label, onClick }: ActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    await onClick();
    setIsLoading(false);
  }

  return (
    <span
      onClick={handleClick}
      className={cn(
        "px-2 py-1 bg-border rounded-md text-sm",
        isLoading ? "text-muted-foreground" : "cursor-pointer"
      )}
    >
      {label}
    </span>
  );
}
