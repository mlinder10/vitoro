"use client";

import { capitalize, cn } from "@/lib/utils";
import { NBMEQuestion, QuestionChoice, Task, TASKS } from "@/types";
import {
  ArrowLeft,
  ArrowUp,
  Loader,
  ChevronDown,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefObject, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  promptChatWithTask,
  promptGeneralChat,
} from "@/app/(protected)/practice/chat";
import { Button } from "@/components/ui/button";

const TASK_DESCRIPTIONS: Record<Task, string> = {
  breakdown: "Get a detailed breakdown of the concept being tested.",
  distractor: "Dive deeper to identify the distractors in this question.",
  "gap-finder": "Bridge knowledge gaps with a focused micro-lesson and reinforce understanding with targeted questions.",
  strategy: "Learn how to think like a doctor building a differential diagnosis before even looking at the answer choices.",
  pattern: "Find patterns that can help you distinguish between related concepts.",
  memory: "Get effective flashcards, cloze deletions, and mnemonics to cement key concepts in long-term memory.",
  "pimp-mode": "Face challenging free-response questions that progress from basic concepts to integration, testing real understanding."
};

// Simple expandable section component matching question-card style
const ExpandableSection = ({
  title,
  children,
  defaultExpanded = false,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  delay?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center bg-secondary hover:bg-secondary/80 mb-2 p-3 rounded-md w-full text-left transition-colors duration-200"
      >
        <span className="font-medium text-custom-accent">{title}</span>
        <div className="transition-transform duration-200">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[500px] opacity-100 mb-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-tertiary p-4 rounded-md">
          <div className="max-h-[400px] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Simple message component matching question-card style
const MessageComponent = ({
  content,
  isUser,
  isTyping = false,
}: {
  content: React.ReactNode;
  isUser: boolean;
  isTyping?: boolean;
}) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex max-w-4xl ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-2`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
            isUser
              ? "bg-custom-accent text-white"
              : "bg-secondary text-foreground"
          }`}
        >
          {isUser ? (
            <div className="w-4 h-4 bg-white rounded-full" />
          ) : (
            <Image
              src="/VITO.png"
              alt="Vito AI"
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          )}
        </div>
        <div
          className={`rounded-md px-4 py-3 max-w-[600px] ${
            isUser ? "bg-custom-accent text-white" : "bg-secondary"
          }`}
        >
          {isTyping ? (
            <div className="flex items-center space-x-1">
              <div className="bg-muted-foreground rounded-full w-2 h-2 animate-bounce"></div>
              <div
                className="bg-muted-foreground rounded-full w-2 h-2 animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="bg-muted-foreground rounded-full w-2 h-2 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
};

type ChatCardProps = {
  question: NBMEQuestion;
  choice: QuestionChoice | null;
  expanded?: boolean;
  onToggleExpand?: () => void;
};

// TODO: read and refactor
export default function ChatCard({
  question,
  choice,
  expanded = false,
  onToggleExpand,
}: ChatCardProps) {
  const [messages, setMessages] = useState<
    {
      id: number;
      content: React.ReactNode;
      isUser: boolean;
      rawText?: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Create AI response component similar to reference
  const createAITutorResponse = (content: string) => {
    // Simple parsing to create expandable sections from AI content
    const sections = content.split("\n## ").filter((section) => section.trim());

    if (sections.length <= 1) {
      // If no sections found, return as regular markdown
      return (
        <div className="max-w-none prose prose-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="my-4 overflow-x-auto">
                  <table className="border border-border min-w-full text-sm border-collapse">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-secondary">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="px-3 py-2 border border-border font-semibold text-left">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3 py-2 border border-border">{children}</td>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {sections.map((section, index) => {
          const lines = section.split("\n");
          const title = lines[0].replace(/^#+\s*/, "").trim();
          const body = lines.slice(1).join("\n").trim();

          return (
            <ExpandableSection
              key={index}
              title={title || `Section ${index + 1}`}
              defaultExpanded={index === 0}
              delay={index * 200}
            >
              <div className="max-w-none prose prose-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ children }) => (
                      <div className="my-4 overflow-x-auto">
                        <table className="border border-border min-w-full text-sm border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-secondary">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="px-3 py-2 border border-border font-semibold text-left">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-2 border border-border">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {body}
                </ReactMarkdown>
              </div>
            </ExpandableSection>
          );
        })}
      </div>
    );
  };

  async function promptWithTask(task: Task) {
    if (!choice) return;
    setIsLoading(true);

    // Simulate AI thinking time like reference
    setTimeout(async () => {
      try {
        let fullContent = "";
        // Convert messages to simple format for server-side processing
        const serverMessages = messages.map((msg) => ({
          role: msg.isUser ? ("user" as const) : ("assistant" as const),
          content:
            msg.rawText || (typeof msg.content === "string" ? msg.content : ""),
        }));
        const res = await promptChatWithTask(
          task,
          question,
          choice,
          serverMessages
        );

        // Collect all content first
        while (true) {
          const { value, done } = await res.next();
          if (done) break;
          fullContent += value;
        }

        // Add complete AI response with expandable sections
        const aiMessage = {
          id: Date.now() + 1,
          content: createAITutorResponse(fullContent),
          isUser: false,
          rawText: fullContent, // Store raw text for server-side context
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in promptWithTask:", error);
        setIsLoading(false);
      }
    }, 800);
  }

  async function promptGeneral() {
    if (!choice || !inputRef.current) return;
    const inputValue = inputRef.current.value.trim();
    if (!inputValue) return;

    setIsLoading(true);
    const userMessage = {
      id: Date.now(),
      content: inputValue,
      isUser: true,
      rawText: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    inputRef.current.value = "";

    // Simulate AI thinking time
    setTimeout(async () => {
      try {
        let fullContent = "";
        const serverMessages = [...messages, userMessage].map((msg) => ({
          role: msg.isUser ? ("user" as const) : ("assistant" as const),
          content:
            msg.rawText || (typeof msg.content === "string" ? msg.content : ""),
        }));

        const res = await promptGeneralChat(question, choice, serverMessages);

        while (true) {
          const { value, done } = await res.next();
          if (done) break;
          fullContent += value;
        }

        const aiMessage = {
          id: Date.now() + 1,
          content: createAITutorResponse(fullContent),
          isUser: false,
          rawText: fullContent,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in promptGeneral:", error);
        setIsLoading(false);
      }
    }, 800);
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

  // Reset messages when question/choice changes
  useEffect(() => {
    setMessages([]);
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
    </section>
  );
}

type MessagesContainerProps = {
  messages: {
    id: number;
    content: React.ReactNode;
    isUser: boolean;
    rawText?: string;
  }[];
  endRef: RefObject<HTMLDivElement | null>;
  handlePromptWithTask: (task: Task) => void;
  isLoading: boolean;
};

function MessagesContainer({
  messages,
  endRef,
  handlePromptWithTask,
  isLoading,
}: MessagesContainerProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 place-items-center grid">
        <div className="flex flex-col items-center gap-2 text-sm">
          <div className="w-24 h-24 flex items-center justify-center">
            <Image
              src="/VITO.png"
              alt="Vito AI"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <p className="text-muted-foreground text-lg">
            I&apos;m here to help!
          </p>
          <div className="gap-2 space-y-2 mt-4 px-4">
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Try asking:</p>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <HelpCircle size={16} />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Prompt Options Guide</DialogTitle>
                    <DialogDescription>
                      Each prompt option provides a different learning approach for analyzing questions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {TASKS.map((task) => (
                      <div key={task} className="border-b border-border pb-3 last:border-b-0">
                        <h4 className="font-semibold text-sm mb-1">
                          {task.split("-").map(capitalize).join(" ")}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {TASK_DESCRIPTIONS[task]}
                        </p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {TASKS.map((task) => (
              <TaskPrompt
                key={task}
                label={task.split("-").map(capitalize).join(" ")}
                onClick={() => handlePromptWithTask(task)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-4 overflow-y-auto">
      {messages.map((message) => (
        <MessageComponent
          key={message.id}
          content={message.content}
          isUser={message.isUser}
        />
      ))}
      {isLoading && (
        <MessageComponent content="" isUser={false} isTyping={true} />
      )}
      <div ref={endRef} />
    </div>
  );
}

type TaskPromptProps = {
  label: string;
  onClick: () => void;
};

function TaskPrompt({ label, onClick }: TaskPromptProps) {
  return (
    <div
      className="bg-muted hover:bg-muted/50 py-2 rounded-md w-[160px] text-center transition cursor-pointer"
      onClick={onClick}
    >
      {label}
    </div>
  );
}
