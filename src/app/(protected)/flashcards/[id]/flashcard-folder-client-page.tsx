"use client";

import { Flashcard } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type FlashcardFolderClientPageProps = {
  folderName: string;
  flashcards: Flashcard[];
};

export default function FlashcardFolderClientPage({
  folderName,
  flashcards,
}: FlashcardFolderClientPageProps) {
  const [index, setIndex] = useState(0);
  const flashcard = flashcards[index];

  function handleNext() {
    setIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1));
  }

  function handlePrev() {
    setIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashcards.length]);

  return (
    <div className="relative place-items-center grid p-6 h-full">
      <div className="top-4 left-1/2 absolute flex flex-col items-center -translate-x-1/2">
        <p className="font-semibold">{folderName}</p>
        <p className="text-muted-foreground text-sm">
          {index + 1} / {flashcards.length}
        </p>
      </div>

      <FlashcardView flashcard={flashcard} />

      <div className="absolute inset-0 flex justify-between items-center px-6 pointer-events-none">
        <button
          onClick={handlePrev}
          aria-label="Previous"
          className="bg-background/80 hover:bg-accent shadow-sm backdrop-blur-md p-2 border rounded-full transition pointer-events-auto"
        >
          <ArrowLeft />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next"
          className="bg-background/80 hover:bg-accent shadow-sm backdrop-blur-md p-2 border rounded-full transition pointer-events-auto"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}

type FlashcardViewProps = {
  flashcard: Flashcard;
};

export function FlashcardView({ flashcard }: FlashcardViewProps) {
  const [side, setSide] = useState<"front" | "back">("front");
  const [revealed, setRevealed] = useState(false);

  function handleFlip() {
    setSide((prev) => (prev === "front" ? "back" : "front"));
    setRevealed(false);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className="relative w-full max-w-xl aspect-[4/3] cursor-pointer perspective"
    >
      <div
        className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{
          transform: side === "back" ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div className="absolute inset-0 flex justify-center items-center bg-tertiary shadow-lg p-6 border rounded-2xl [backface-visibility:hidden]">
          <FlashcardSideView
            text={flashcard.front}
            revealed={revealed}
            setRevealed={setRevealed}
            onFlip={handleFlip}
          />
        </div>

        <div className="absolute inset-0 flex justify-center items-center bg-tertiary shadow-lg p-6 border rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <FlashcardSideView
            text={flashcard.back}
            revealed={revealed}
            setRevealed={setRevealed}
            onFlip={handleFlip}
          />
        </div>
      </div>
    </div>
  );
}

type FlashcardSideViewProps = {
  text: string;
  revealed: boolean;
  setRevealed: (r: boolean) => void;
  onFlip: () => void;
};

function FlashcardSideView({
  text,
  revealed,
  setRevealed,
  onFlip,
}: FlashcardSideViewProps) {
  const isCloze = text.includes("{{") && text.includes("}}");

  const handleAction = useCallback(() => {
    if (isCloze && !revealed) setRevealed(true);
    else onFlip();
  }, [isCloze, onFlip, revealed, setRevealed]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        handleAction();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [revealed, isCloze, handleAction]);

  return (
    <div
      className="flex justify-center items-center w-full h-full"
      onClick={handleAction}
    >
      <div className="flex flex-col text-center">
        {isCloze ? (
          <ClozView text={text} revealed={revealed} />
        ) : (
          <ReactMarkdown>{text}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}

type ClozViewProps = {
  text: string;
  revealed: boolean;
};

function ClozView({ text, revealed }: ClozViewProps) {
  const clozedText = text.replace(/\{\{(.*?)\}\}/g, (_, inner) =>
    revealed ? inner : "____"
  );

  return <ReactMarkdown>{clozedText}</ReactMarkdown>;
}
