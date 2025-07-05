import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Question, QuestionChoice } from "@/types";
import { ArrowLeft, ArrowUp, Loader } from "lucide-react";
import { RefObject, useEffect, useRef, useState } from "react";
import { createReviewQuestion, promptChat } from "../actions";
import ReactMarkdown from "react-markdown";
import { KeyboardEvent } from "react";
import { useSession } from "@/contexts/session-provider";
import { toast } from "sonner";

type ChatboxProps = {
  question: Question;
  answer: QuestionChoice | null;
};

export default function ChatBox({ question, answer }: ChatboxProps) {
  const { id } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Prompting ----------------------------------------------------------------

  async function handlePrompt() {
    if (!inputRef.current || !answer) return;
    const newMessages = [...messages, inputRef.current.value];
    inputRef.current.value = "";
    setMessages(newMessages);
    setIsLoading(true);
    const stream = await promptChat(question, answer, newMessages);
    while (true) {
      const { value, done } = await stream.next();
      if (done) break;
      streamCompletionHandler(value);
    }
    setIsLoading(false);
  }

  function streamCompletionHandler(token: string) {
    setMessages((prev) => {
      if (prev.length % 2 === 1) return [...prev, token];
      const last = prev[prev.length - 1];
      return [...prev.slice(0, -1), last + token];
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

  if (!answer) return null;

  return (
    <section
      className={cn(
        "flex flex-col flex-1 bg-background border-2 rounded-md relative transition-all",
        isExpanded && "flex-3"
      )}
    >
      <MessagesContainer messages={messages} endRef={endRef} />
      <div className="mx-4 mb-4 border-2 rounded-md">
        <textarea
          placeholder="Ask a question..."
          disabled={isLoading}
          className="p-2 border-none outline-none w-full font-sans resize-none"
          ref={inputRef}
          onKeyDown={(e) => handleInput(e)}
        />
        <div className="flex justify-between items-center p-2">
          <div className="flex flex-wrap gap-2">
            <PromptTemplate
              label="Create Review Question"
              onClick={handleCreateReview}
            />
          </div>
          <Button
            variant="accent-tertiary"
            size="icon"
            className="rounded-full"
            onClick={handlePrompt}
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : <ArrowUp />}
          </Button>
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
  endRef: RefObject<HTMLDivElement | null>;
};

function MessagesContainer({ messages, endRef }: MessagesContainerProps) {
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

type PromptTemplateProps = {
  label: string;
  onClick: () => void;
};

function PromptTemplate({ label, onClick }: PromptTemplateProps) {
  return (
    <span
      onClick={onClick}
      className="px-2 py-1 bg-border rounded-md text-sm cursor-pointer"
    >
      {label}
    </span>
  );
}
