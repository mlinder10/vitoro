"use client";

import { cn, formatNumber } from "@/lib/utils";
import { Prompt } from "@/types";
import { useState } from "react";

type PromptContainerProps = {
  prompt: Prompt;
};

export default function PromptContainer({ prompt }: PromptContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li className="space-y-4 bg-tertiary p-4 border rounded-md">
      <p
        className={cn("cursor-pointer", !isExpanded && "line-clamp-2")}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {prompt.prompt}
      </p>
      <div className="flex gap-2 text-muted-foreground text-sm">
        <span>Input: {formatNumber(prompt.inputTokens)}</span>
        <span>•</span>
        <span>Output: {formatNumber(prompt.outputTokens)}</span>
        <span>•</span>
        <span>{prompt.createdAt.toLocaleString()}</span>
      </div>
    </li>
  );
}
