import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Question, QuestionChoice } from "@/types";
import { ArrowUp, Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ChatboxProps = {
  question: Question;
  answer: QuestionChoice | null;
};

export default function ChatBox({ answer }: ChatboxProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  async function handlePrompt(prompt?: string) {
    if (prompt === undefined) prompt = inputRef.current?.value;
    if (!prompt) return;

    inputRef.current!.value = "";
    setMessages((prev) => [...prev, prompt]);
    setIsLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunk = decoder.decode(value);
      streamCompletionHandler(chunk);
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

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!answer) return null;

  return (
    <section className="flex flex-col flex-1 bg-background border-2 rounded-md">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "rounded-md p-2 mb-2 w-fit",
              index % 2 === 0 ? "ml-auto bg-secondary max-w-7/8" : "bg-border"
            )}
          >
            {message}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="mx-4 mb-4 border-2 rounded-md">
        <textarea
          placeholder="Ask a question..."
          disabled={isLoading}
          className="p-2 border-none outline-none w-full font-sans resize-none"
          ref={inputRef}
        />
        <div className="flex justify-between items-center p-2">
          <div className="flex flex-wrap gap-2">
            <PromptTemplate
              label="Explain"
              value="explain"
              onClick={handlePrompt}
            />
            <PromptTemplate
              label="Generate"
              value="generate"
              onClick={handlePrompt}
            />
            <PromptTemplate
              label="Explain"
              value="explain"
              onClick={handlePrompt}
            />
            <PromptTemplate
              label="Generate"
              value="generate"
              onClick={handlePrompt}
            />
          </div>
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
    </section>
  );
}

type PromptTemplateProps = {
  label: string;
  value: string;
  onClick: (value: string) => void;
};

function PromptTemplate({ label, value, onClick }: PromptTemplateProps) {
  return (
    <span
      onClick={() => onClick(value)}
      className="px-2 py-1 bg-border rounded-md text-sm cursor-pointer"
    >
      {label}
    </span>
  );
}
