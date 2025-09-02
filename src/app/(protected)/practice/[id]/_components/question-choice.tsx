import { cn } from "@/lib/utils";
import { QBankMode, QuestionChoice } from "@/types";
import { useState } from "react";

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

export default function QuestionChoiceView({
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

  function handleDisable(e: React.MouseEvent) {
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
        "group flex items-center gap-2 bg-background-secondary p-4 border rounded-md transition-all",
        // disabled
        !canShowInsights &&
          isDisabled &&
          "cursor-not-allowed opacity-50 line-through",
        // not checked and not selected
        !isChecked && !isLoading && "cursor-pointer hover:bg-muted",
        // selected and not checked
        isSelected &&
          !isChecked &&
          "border-custom-accent hover:border-custom-accent bg-custom-accent-light",
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
          !isChecked && !isLoading && "group-hover:bg-muted",
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
