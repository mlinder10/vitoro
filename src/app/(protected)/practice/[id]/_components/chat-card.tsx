import { capitalize, cn } from "@/lib/utils";
import { Message, Question, QuestionChoice, Task, TASKS } from "@/types";
import { ArrowLeft, ArrowUp, BotIcon, Loader } from "lucide-react";
import { RefObject, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { promptChatWithTask, promptGeneralChat } from "../../chat";
import { Button } from "@/components/ui/button";

type ChatCardProps = {
  question: Question;
  choice: QuestionChoice;
};

export default function ChatCard({ question, choice }: ChatCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Prompting ----------------------------------------------------------------

  async function promptWithTask(task: Task) {
    if (!choice) return;
    setIsLoading(true);
    const res = await promptChatWithTask(task, question, choice);
    while (true) {
      const { value, done } = await res.next();
      if (done) break;
      streamCompletionHandler(value);
    }
    setIsLoading(false);
  }

  async function promptGeneral() {
    if (!choice || !inputRef.current) return;
    setIsLoading(true);
    const newMessage: Message = {
      role: "user",
      content: inputRef.current.value,
    };
    setMessages((prev) => [...prev, newMessage]);
    inputRef.current.value = "";
    const res = await promptGeneralChat(question, choice, messages);
    while (true) {
      const { value, done } = await res.next();
      if (done) break;
      streamCompletionHandler(value);
    }
    setIsLoading(false);
  }

  function streamCompletionHandler(token: string) {
    setMessages((prev) => {
      if (prev.length === 0 || prev[prev.length - 1].role === "user")
        return [...prev, { role: "assistant", content: token }];
      const last = prev[prev.length - 1];
      return [...prev.slice(0, -1), { ...last, content: last.content + token }];
    });
  }

  function handleInput(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      promptGeneral();
    }
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section
      className={cn(
        "relative flex flex-col flex-1 bg-tertiary border rounded-md h-full transition-all",
        isExpanded && "flex-3"
      )}
    >
      <MessagesContainer
        messages={messages}
        endRef={endRef}
        handlePromptWithTask={promptWithTask}
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
  messages: Message[];
  endRef: RefObject<HTMLDivElement | null>;
  handlePromptWithTask: (task: Task) => void;
};

function MessagesContainer({
  messages,
  endRef,
  handlePromptWithTask,
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
    <div className="flex-1 space-y-6 px-4 py-16 overflow-y-auto">
      {messages.map((message, index) =>
        message.role === "user" ? (
          <div
            key={index}
            className="bg-secondary my-2 ml-auto p-2 rounded-md w-fit max-w-7/8"
          >
            {message.content}
          </div>
        ) : (
          <ReactMarkdown key={index}>{message.content}</ReactMarkdown>
        )
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
