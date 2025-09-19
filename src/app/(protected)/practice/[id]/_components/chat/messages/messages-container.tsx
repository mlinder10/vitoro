import { capitalize } from "@/lib/utils";
import { Message, Task, TASKS } from "@/types";
import Image from "next/image";
import { RefObject } from "react";
import MessageComponent from "./message-component";
import TaskPrompt, { TaskTooltip } from "./task-prompt";

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
  if (messages.length === 0 && !isLoading) {
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
          <div className="space-y-4 mt-4 px-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <p>Try asking:</p>
              <TaskTooltip />
            </div>
            <div className="gap-2 grid grid-cols-2">
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
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 py-16 overflow-y-auto">
      {messages.map((message, index) => (
        <div key={message.id}>
          <MessageComponent content={message.content} role={message.role} />

          {/* Show Tasks List */}
          {message.role === "assistant" &&
            message.content.includes("Try a different approach") &&
            index === messages.length - 1 && (
              <div className="space-y-4 bg-secondary ml-10 p-4 px-4 rounded-md max-w-[600px]">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <p>Try asking:</p>
                  <TaskTooltip />
                </div>
                <div className="place-items-center gap-2 grid grid-cols-2">
                  {TASKS.map((task) => (
                    <TaskPrompt
                      key={task}
                      label={task.split("-").map(capitalize).join(" ")}
                      onClick={() => handlePromptWithTask(task)}
                    />
                  ))}
                </div>
              </div>
            )}
        </div>
      ))}
      {isLoading && (
        <MessageComponent content="" role={"assistant"} isTyping={true} />
      )}
      <div ref={endRef} />
    </div>
  );
}
