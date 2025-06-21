"use client";

import { Button } from "@/components/ui/button";
import { ParsedQuestion, QuestionChoice } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Circle, CircleCheck, CircleX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/contexts/session-provider";
import { answerQuestion } from "../actions";

type QuestionViewProps = {
  question: ParsedQuestion;
};

export default function QuestionView({ question }: QuestionViewProps) {
  const { id } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState<QuestionChoice | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  async function handleSubmit() {
    if (!selection) return;
    setIsLoading(true);
    await answerQuestion(id, question.id, selection);
    setIsLoading(false);
    setIsChecked(true);
  }

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
              isLoading={isLoading}
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
          <Button variant="accent" onClick={handleSubmit} disabled={isLoading}>
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
  isLoading: boolean;
  select: (letter: QuestionChoice) => void;
};

function QuestionChoiceView({
  choice,
  explanation,
  letter,
  isChecked,
  isSelected,
  isCorrect,
  isLoading,
  select,
}: QuestionChoiceViewProps) {
  function handleSelect() {
    if (!isChecked && !isLoading) select(letter);
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
        !isChecked && !isLoading && "cursor-pointer"
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
