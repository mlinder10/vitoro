import { cn } from "@/lib/utils";
import { QBankMode, QuestionChoice } from "@/types";
import { useEffect, useState } from "react";

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
  /**
   * When true, the explanation for a selected choice is automatically
   * shown after the answer is checked. When false, only the correct
   * choice's explanation is displayed by default.
   */
  showSelectionExplanation?: boolean;
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
  showSelectionExplanation = true,
}: QuestionChoiceViewProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const canShowInsights = isChecked && mode === "tutor";

  useEffect(() => {
    if (isChecked) {
      setShowExplanation(isCorrect || (showSelectionExplanation && isSelected));
    } else {
      setShowExplanation(false);
    }
  }, [isChecked, isCorrect, isSelected, showSelectionExplanation]);

  function handleSelect() {
    if (isDisabled) return;
    if (isChecked) {
      setShowExplanation((prev) => !prev);
      return;
    }
    if (!isLoading) select(letter);
  }

  function handleDisable(e: React.MouseEvent) {
    if (isChecked || isLoading) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDisabled((prev) => !prev);
    if (isSelected) select(null); // unselect
  }

  function getChoiceStyle() {
    if (isDisabled && !isChecked) {
      return "bg-secondary border-border opacity-60 line-through";
    }

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
          <span
            className={cn("min-w-[20px] font-semibold text-sm sm:text-base")}
          >
            {letter.toUpperCase()}.
          </span>
          <span className={cn("flex-1 text-sm sm:text-base md:text-lg")}>
            {choice}
          </span>
        </div>
      </div>

      {/* Show explanation after answer is checked */}
      {isChecked && showExplanation && (
        <div
          className={cn("bg-muted ml-7 p-3 rounded-md text-sm sm:text-base")}
        >
          <p className={cn("text-muted-foreground text-sm sm:text-base")}>
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
