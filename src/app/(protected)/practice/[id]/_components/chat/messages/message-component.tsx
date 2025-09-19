import Image from "next/image";
import TutorResponse from "./tutor-response";
import { cn } from "@/lib/utils";

type MessageComponentProps = {
  content: string;
  role: "user" | "assistant";
  isTyping?: boolean;
};

export default function MessageComponent({
  content,
  role,
  isTyping = false,
}: MessageComponentProps) {
  const isUser = role === "user";

  function renderMessage() {
    if (isTyping) return <TypingMessage />;
    if (isUser) return content;
    return <TutorResponse content={content} />;
  }

  function renderIcon() {
    if (isUser) return <div className="bg-custom-accent text-white" />;
    return (
      <Image
        src="/VITO.png"
        alt="Vito AI"
        width={24}
        height={24}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div className={cn("flex mb-4", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex items-start gap-2 max-w-4xl",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div
          className={cn(
            "flex flex-shrink-0 justify-center items-center rounded-full w-8 h-8 overflow-hidden",
            isUser
              ? "bg-custom-accent text-white"
              : "bg-secondary text-foreground"
          )}
        >
          {renderIcon()}
        </div>
        <div
          className={cn(
            "px-4 py-3 rounded-md max-w-[600px]",
            isUser ? "bg-custom-accent text-white" : "bg-secondary"
          )}
        >
          {renderMessage()}
        </div>
      </div>
    </div>
  );
}

function TypingMessage() {
  return (
    <div className="flex items-center space-x-1 py-1">
      <div className="bg-muted-foreground rounded-full w-2 h-2 animate-bounce" />
      <div
        className="bg-muted-foreground rounded-full w-2 h-2 animate-bounce"
        style={{ animationDelay: "0.15s" }}
      />
      <div
        className="bg-muted-foreground rounded-full w-2 h-2 animate-bounce"
        style={{ animationDelay: "0.3s" }}
      />
    </div>
  );
}
