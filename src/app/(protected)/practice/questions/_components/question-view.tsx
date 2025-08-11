"use client";

import { Button } from "@/components/ui/button";
import { Question, QuestionChoice } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import ChatBox from "./chat-box";
import { QBankMode } from "@/contexts/qbank-session-provider";

type QuestionViewProps = {
  mode: QBankMode;
  time: number | null;
  question: Question;
  isLoading: boolean;
  isChecked: boolean;
  selection: QuestionChoice | null;
  setSelection: Dispatch<SetStateAction<QuestionChoice | null>>;
  handleSubmit: () => void;
  handleNextQuestion: () => Promise<void>;
};

export default function QuestionView({
  question,
  mode,
  time,
  isLoading,
  isChecked,
  selection,
  setSelection,
  handleNextQuestion,
  handleSubmit,
}: QuestionViewProps) {
  const stemRef = useRef<HTMLParagraphElement>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  function handleRemoveHighlight(e: globalThis.MouseEvent) {
    const element = e.target as HTMLElement;
    if (element.classList.contains("highlight")) {
      element.classList.remove("highlight");
    }
  }

  useEffect(() => {
    function handleHighlight() {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();
      if (!selectedText) return;

      const span = document.createElement("span");
      span.classList.add("highlight");
      span.textContent = selectedText;
      span.addEventListener("click", handleRemoveHighlight);

      range.deleteContents();
      range.insertNode(span);

      selection.removeAllRanges();
    }

    const element = stemRef.current;
    if (!element) return;

    element.addEventListener("mouseup", handleHighlight);
    return () => element.removeEventListener("mouseup", handleHighlight);
  }, []);

  return (
    <div className="flex flex-10 gap-8 p-8">
      <section className="flex flex-col flex-3 bg-background p-4 border-2 rounded-md overflow-y-auto">
        <div className="flex justify-between">
          <p className="mb-2 font-semibold text-lg">Question</p>
          {time && (
            <span className={cn(time <= 60 && "text-red-500")}>
              {formatTime(time)}
            </span>
          )}
        </div>
        <p ref={stemRef}>{question.question}</p>
        <div className="flex flex-col flex-1 justify-end gap-4 mt-8">
          <ul className="flex flex-col gap-2">
            {Object.entries(question.choices).map(([letter]) => (
              <QuestionChoiceView
                key={question.choices[letter as QuestionChoice]}
                mode={mode}
                choice={question.choices[letter as QuestionChoice]}
                explanation={question.explanations[letter as QuestionChoice]}
                letter={letter as QuestionChoice}
                isChecked={isChecked}
                isSelected={letter === selection}
                isCorrect={letter === question.answer}
                isLoading={isLoading}
                select={setSelection}
              />
            ))}
          </ul>
          {isChecked ? (
            <Button variant="accent" onClick={handleNextQuestion}>
              <span>Next</span>
              <ArrowRight />
            </Button>
          ) : (
            <Button
              variant="accent"
              onClick={handleSubmit}
              disabled={isLoading || selection === null}
            >
              <span>Submit</span>
            </Button>
          )}
        </div>
      </section>
      {isChecked && mode === "tutor" && (
        <ChatBox question={question} answer={selection} />
      )}
    </div>
  );
}

type QuestionChoiceViewProps = {
  mode: QBankMode;
  choice: string;
  explanation: string;
  letter: QuestionChoice;
  isChecked: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  isLoading: boolean;
  select: (letter: QuestionChoice | null) => void;
};

function QuestionChoiceView({
  mode,
  choice,
  explanation,
  letter,
  isChecked,
  isSelected,
  isCorrect,
  isLoading,
  select,
}: QuestionChoiceViewProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const canShowInsights = isChecked && mode === "tutor";

  function handleSelect() {
    if (isDisabled) return;
    if (!isChecked && !isLoading) select(letter);
  }

  function handleDisable(e: MouseEvent) {
    if (isChecked || isLoading) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDisabled((prev) => !prev);
    if (isSelected) select(null); // unselect
  }

  return (
    <li
      onClick={handleSelect}
      onContextMenu={handleDisable}
      className={cn(
        "group flex items-center gap-2 bg-background p-2 border-2 rounded-md",
        // disabled
        !canShowInsights &&
          isDisabled &&
          "cursor-not-allowed opacity-50 line-through",
        // not checked and not selected
        !isChecked &&
          !isLoading &&
          "cursor-pointer hover:border-custom-accent-light",
        // selected and not checked
        isSelected &&
          !isChecked &&
          "border-custom-accent hover:border-custom-accent",
        // checked and incorrect
        isSelected && canShowInsights && !isCorrect && "border-destructive",
        // checked and correct
        canShowInsights && isCorrect && "border-green-500"
      )}
    >
      <div
        className={cn(
          "flex justify-center items-center mx-1 px-2 border-2 rounded-full aspect-square font-bold text-lg",
          // not checked and not selected
          !isChecked && !isLoading && "group-hover:border-custom-accent-light",
          // selected and not checked
          isSelected &&
            !isChecked &&
            "border-custom-accent group-hover:border-custom-accent",
          // checked and incorrect
          isSelected && canShowInsights && !isCorrect && "border-destructive",
          // checked and correct
          canShowInsights && isCorrect && "border-green-500"
        )}
      >
        {letter.toUpperCase()}
      </div>
      <div>
        <p>{choice}</p>
        {canShowInsights && (
          <p className="text-muted-foreground text-sm">{explanation}</p>
        )}
      </div>
    </li>
  );
}
