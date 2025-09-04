import { cn } from "@/lib/utils";
import { QuestionChoice } from "@/types";

type PlaygroundQuestionChoiceProps = {
  letter: QuestionChoice;
  choice: string;
  explanation: string;
  isCorrect: boolean;
  isSelected: boolean;
  select: (choice: QuestionChoice) => void;
  isChecked: boolean;
};

export default function PlaygroundQuestionChoice({
  letter,
  choice,
  explanation,
  isCorrect,
  isSelected,
  select,
  isChecked,
}: PlaygroundQuestionChoiceProps) {
  function getChoiceStyle() {
    if (!isChecked) {
      return isSelected
        ? "bg-custom-accent/20 border-custom-accent"
        : "bg-secondary hover:bg-secondary/80 border-border";
    }

    if (isCorrect) {
      return "bg-green-100 border-green-500 dark:bg-green-900/20 dark:border-green-400";
    }

    if (isSelected && !isCorrect) {
      return "bg-red-100 border-red-500 dark:bg-red-900/20 dark:border-red-400";
    }

    return "bg-secondary border-border opacity-60";
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "p-4 border-2 rounded-md cursor-pointer transition-all",
          getChoiceStyle()
        )}
        onClick={() => !isChecked && select(letter)}
      >
        <div className="flex gap-3">
          <span className="font-semibold text-sm min-w-[20px]">
            {letter.toUpperCase()}.
          </span>
          <span className="flex-1">{choice}</span>
        </div>
      </div>

      {/* Show explanation after answer is checked */}
      {isChecked && (isCorrect || isSelected) && (
        <div className="ml-7 p-3 bg-muted rounded-md text-sm">
          <p className="text-muted-foreground">{explanation}</p>
        </div>
      )}
    </div>
  );
}
