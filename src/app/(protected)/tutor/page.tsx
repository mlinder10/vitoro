"use client";

import GradientTitle from "@/components/gradient-title";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useChatHistory from "@/hooks/use-chat-history";
import { cn } from "@/lib/utils";
import { ArrowUp, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import QuestionUpload, {
  DEFAULT_MULTIPLE_CHOICE,
  MultipleChoiceQuestion,
} from "./question-upload";
import TutorSettings from "./tutor-settings";
import useDeepState from "@/hooks/use-deep-state";

const BASE_PROMPT = (tone: string) =>
  `Respond with the following tone: ${tone}`;

export default function TutorPage() {
  const [tone, setTone] = useState<string>("Donald Trump");
  const { messages, isLoading, chatStreamed } = useChatHistory({
    basePrompt: BASE_PROMPT(tone),
  });
  const [question, updateQuestion] = useDeepState<MultipleChoiceQuestion>(
    DEFAULT_MULTIPLE_CHOICE
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleInput(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && inputRef.current && !isLoading) {
      e.preventDefault();
      const inputValue = inputRef.current.value.trim();
      inputRef.current.value = "";
      chatStreamed(inputValue);
    }
  }

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex justify-between items-center bg-tertiary px-4 py-2 border-b w-full">
        <GradientTitle text="Tutor" className="font-bold text-lg" />
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="accent-light">
                Upload Question
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col min-w-[80vw] h-[80vh]">
              <DialogHeader>
                <DialogTitle>Question Upload</DialogTitle>
              </DialogHeader>
              <QuestionUpload question={question} onUpdate={updateQuestion} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Settings />
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-fit">
              <DialogHeader>
                <DialogTitle>Tutor Settings</DialogTitle>
              </DialogHeader>
              <TutorSettings tone={tone} setTone={setTone} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-8 p-8 pb-64 overflow-y-auto">
        {messages.map((m) => (
          <MessageComponent key={m.id} message={m.content} role={m.role} />
        ))}
        <div ref={endRef} />
      </div>
      <div className="right-4 bottom-4 left-4 absolute flex flex-col bg-background/50 backdrop-blur-md border rounded-md">
        <textarea
          ref={inputRef}
          className="p-4 focus:outline-none h-32 resize-none"
          placeholder="Ask a question..."
          onKeyDown={handleInput}
        />
        <div className="flex justify-end p-4">
          <Button
            variant="accent"
            className="ml-auto rounded-full"
            disabled={isLoading}
          >
            <ArrowUp />
          </Button>
        </div>
      </div>
    </div>
  );
}

type MessageComponentProps = {
  message: string;
  role: "user" | "assistant";
};

function MessageComponent({ message, role }: MessageComponentProps) {
  return role === "user" ? (
    <UserMessage message={message} />
  ) : (
    <AssistantMessage message={message} />
  );
}

function UserMessage({ message }: Omit<MessageComponentProps, "role">) {
  return (
    <div className={cn("bg-tertiary ml-auto px-4 py-2 rounded-md max-w-4/5")}>
      {message}
    </div>
  );
}

function AssistantMessage({ message }: Omit<MessageComponentProps, "role">) {
  return <ReactMarkdown>{message}</ReactMarkdown>;
}
