import Image from "next/image";

type MessageComponentProps = {
  content: React.ReactNode;
  isUser: boolean;
  isTyping?: boolean;
};

export default function MessageComponent({
  content,
  isUser,
  isTyping = false,
}: MessageComponentProps) {
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
            <div className="bg-white rounded-full w-4 h-4" />
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
}
