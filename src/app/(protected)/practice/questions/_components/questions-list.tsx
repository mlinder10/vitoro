import { cn } from "@/lib/utils";
import { Question, QuestionChoice } from "@/types";
import { Check, Flag, X } from "lucide-react";
import { MouseEvent } from "react";

type QuestionsListProps = {
  questions: Question[];
  answers: (QuestionChoice | null)[];
  flagged: string[];
  setFlagged: (flagged: string[]) => void;
  index: number;
  setIndex: (index: number) => void;
};

export default function QuestionsList({
  questions,
  answers,
  flagged,
  setFlagged,
  index,
  setIndex,
}: QuestionsListProps) {
  function handleFlagQuestion(e: MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (flagged.includes(id)) {
      setFlagged(flagged.filter((f) => f !== id));
    } else {
      setFlagged([...flagged, id]);
    }
  }

  return (
    <ul className="flex-1 bg-background border-r overflow-y-auto">
      {questions.map((q, i) => (
        <li
          key={q.id}
          className={cn(
            "place-items-center grid grid-cols-3 py-2 border-b text-muted-foreground text-sm cursor-pointer",
            index === i && "font-semibold text-primary border border-primary"
          )}
          onClick={() => setIndex(i)}
          onContextMenu={(e) => handleFlagQuestion(e, q.id)}
        >
          <span>{i + 1}</span>
          {answers[i] === null ? (
            <span />
          ) : answers[i] === q.answer ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <X size={16} className="text-red-500" />
          )}
          {flagged.includes(q.id) ? (
            <Flag size={16} className="text-destructive" />
          ) : (
            <span />
          )}
        </li>
      ))}
    </ul>
  );
}
