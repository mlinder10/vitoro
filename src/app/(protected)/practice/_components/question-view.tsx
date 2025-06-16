"use client";

import { Button } from "@/components/ui/button";
import { ParsedQuestion, QuestionChoice } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Circle, CircleCheck, CircleX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type QuestionViewProps = {
  question: ParsedQuestion;
};

export default function QuestionView({ question }: QuestionViewProps) {
  const [selection, setSelection] = useState<QuestionChoice | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <section className="p-4">
        <p>{question.question}</p>
      </section>
      <section className="flex flex-col flex-1 justify-end gap-4 p-4">
        <ul className="flex flex-col gap-2">
          {Object.entries(question.choices).map(([letter]) => (
            <QuestionChoiceView
              key={letter}
              choice={question.choices[letter as QuestionChoice]}
              explanation={question.explanations[letter as QuestionChoice]}
              letter={letter as QuestionChoice}
              isChecked={isChecked}
              isSelected={letter === selection}
              isCorrect={letter === question.answer}
              select={setSelection}
            />
          ))}
        </ul>
        {isChecked ? (
          <Button className="ml-auto w-fit" variant="accent" asChild>
            <Link href="/practice" className="flex items-center gap-2">
              <span>Next</span>
              <ArrowRight />
            </Link>
          </Button>
        ) : (
          <Button variant="accent" onClick={() => setIsChecked(true)}>
            <span>Submit</span>
          </Button>
        )}
      </section>
    </div>
  );
}

type QuestionChoiceViewProps = {
  choice: string;
  explanation: string;
  letter: QuestionChoice;
  isChecked: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  select: (letter: QuestionChoice) => void;
};

function QuestionChoiceView({
  choice,
  explanation,
  letter,
  isChecked,
  isSelected,
  isCorrect,
  select,
}: QuestionChoiceViewProps) {
  function handleSelect() {
    if (!isChecked) select(letter);
  }

  function renderIcon() {
    if (isCorrect && isChecked)
      return <CircleCheck className="text-green-500" />;
    if (!isSelected) return <Circle />;
    return isChecked ? <CircleX className="text-red-500" /> : <CircleCheck />;
  }

  return (
    <li
      onClick={handleSelect}
      className={cn(
        "flex items-center gap-2 bg-background p-2 border-2 rounded-md",
        !isChecked && "cursor-pointer"
      )}
    >
      {renderIcon()}
      <span className="font-bold text-lg">{letter.toUpperCase()}</span>
      <div>
        <p>{choice}</p>
        {isChecked && (
          <p className="text-muted-foreground text-sm">{explanation}</p>
        )}
      </div>
    </li>
  );
}
