import { cn } from "@/lib/utils";
import { QBankMode, QuestionChoice } from "@/types";
import { useState } from "react";

type QuestionChoiceViewProps = {
  letter: QuestionChoice;
  choice: string;
  explanation: string;
  isCorrect: boolean;
  isSelected: boolean;
  isChecked: boolean;
  mode: QBankMode;
  isLoading: boolean;
  select: (choice: QuestionChoice | null) => void;
};

export default function QuestionChoiceView({
  letter,
  choice,
  explanation,
  isCorrect,
  isSelected,
  isChecked,
  mode,
  isLoading,
  select,
}: QuestionChoiceViewProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const canShowInsights = isChecked && mode === "tutor";

  function handleSelect() {
    if (isDisabled) return;
    if (!isChecked && !isLoading) select(letter);
  }

  function handleDisable(e: React.MouseEvent) {
    if (isChecked || isLoading) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDisabled((prev) => !prev);
    if (isSelected) select(null); // unselect
  }

  function getChoiceStyle() {
    if (!canShowInsights) {
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
          "p-4 border-2 rounded-md transition-all cursor-pointer",
          getChoiceStyle()
        )}
        onClick={handleSelect}
        onContextMenu={handleDisable}
      >
        <div className="flex gap-3">
          <span className="min-w-[20px] font-semibold text-sm">
            {letter.toUpperCase()}.
          </span>
          <span className="flex-1">{choice}</span>
        </div>
      </div>

      {/* Show explanation after answer is checked */}
      {isChecked && (isCorrect || isSelected) && (
        <div className="bg-muted ml-7 p-3 rounded-md text-sm">
          <p className="text-muted-foreground">{explanation}</p>
        </div>
      )}
    </div>
  );
}
