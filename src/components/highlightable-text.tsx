"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Highlight = { start: number; end: number };

type HighlightableTextProps = {
  text: string;
  className?: string;
};

export default function HighlightableText({
  text,
  className,
}: HighlightableTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  function handleMouseUp() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    if (!ref.current || !ref.current.contains(selection.anchorNode)) return;

    const range = selection.getRangeAt(0);

    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(ref.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;
    const end = start + range.toString().length;

    if (start === end) return;

    setHighlights((prev) => [...prev, { start, end }]);

    selection.removeAllRanges();
  }

  function handleClick(e: React.MouseEvent<HTMLSpanElement>) {
    const target = e.target as HTMLElement;
    if (target.dataset.index) {
      const index = parseInt(target.dataset.index, 10);
      setHighlights((prev) => prev.filter((_, i) => i !== index));
    }
  }

  function renderText() {
    if (highlights.length === 0) return text;

    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const chunks: React.ReactNode[] = [];
    let lastIndex = 0;

    sorted.forEach((h, i) => {
      if (lastIndex < h.start) {
        chunks.push(text.slice(lastIndex, h.start));
      }
      chunks.push(
        <span
          key={i}
          data-index={i}
          onClick={handleClick}
          className="cursor-pointer highlight"
        >
          {text.slice(h.start, h.end)}
        </span>
      );
      lastIndex = h.end;
    });

    if (lastIndex < text.length) {
      chunks.push(text.slice(lastIndex));
    }

    return chunks;
  }

  return (
    <p
      ref={ref}
      className={cn(
        "text-sm sm:text-base md:text-lg leading-relaxed select-text",
        className
      )}
      onMouseUp={handleMouseUp}
    >
      {renderText()}
    </p>
  );
}
