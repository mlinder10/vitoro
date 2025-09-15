import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { capitalize } from "@/lib/utils";
import { Message, Task, TASKS } from "@/types";
import { HelpCircle } from "lucide-react";
import Image from "next/image";
import { RefObject } from "react";
import MessageComponent from "./message-component";
import TaskPrompt from "./task-prompt";

const TASK_DESCRIPTIONS: Record<Task, string> = {
  breakdown: "Get a detailed breakdown of the concept being tested.",
  distractor: "Dive deeper to identify the distractors in this question.",
  "gap-finder":
    "Bridge knowledge gaps with a focused micro-lesson and reinforce understanding with targeted questions.",
  strategy:
    "Learn how to think like a doctor building a differential diagnosis before even looking at the answer choices.",
  pattern:
    "Find patterns that can help you distinguish between related concepts.",
  memory:
    "Get effective flashcards, cloze deletions, and mnemonics to cement key concepts in long-term memory.",
  "pimp-mode":
    "Face challenging free-response questions that progress from basic concepts to integration, testing real understanding.",
};

type MessagesContainerProps = {
  messages: Message[];
  endRef: RefObject<HTMLDivElement | null>;
  handlePromptWithTask: (task: Task) => void;
  isLoading: boolean;
};

export default function MessagesContainer({
  messages,
  endRef,
  handlePromptWithTask,
  isLoading,
}: MessagesContainerProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 place-items-center grid">
        <div className="flex flex-col items-center gap-2 text-sm">
          <div className="flex justify-center items-center w-24 h-24">
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
                      Each prompt option provides a different learning approach
                      for analyzing questions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {TASKS.map((task) => (
                      <div
                        key={task}
                        className="pb-3 border-b border-border last:border-b-0"
                      >
                        <h4 className="mb-1 font-semibold text-sm">
                          {task.split("-").map(capitalize).join(" ")}
                        </h4>
                        <p className="text-muted-foreground text-sm">
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
    <div className="flex-1 p-4 py-16 overflow-y-auto">
      {messages.map((message) => (
        <MessageComponent
          key={message.id}
          content={message.content}
          role={message.role}
        />
      ))}
      {isLoading && (
        <MessageComponent content="" role={"assistant"} isTyping={true} />
      )}
      <div ref={endRef} />
    </div>
  );
}
