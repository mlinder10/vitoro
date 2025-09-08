import { cn } from "@/lib/utils";
import { NBMEQuestion, QBankMode, QuestionChoice } from "@/types";
import { Check, X } from "lucide-react";

type QuestionNavigatorProps = {
  questions: NBMEQuestion[];
  answers: (QuestionChoice | null)[];
  activeQuestion: NBMEQuestion;
  onSelect: (question: NBMEQuestion, index: number) => void;
  mode: QBankMode;
};

export default function QuestionNavigator({
  questions,
  answers,
  activeQuestion,
  onSelect,
  mode,
}: QuestionNavigatorProps) {
  return (
    <nav className="flex flex-col bg-tertiary border-r w-[300px] h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Question Navigator</h2>
        <p className="text-muted-foreground text-sm">
          {answers.filter((a) => a !== null).length} of {questions.length} answered
        </p>
      </div>
      <div className="flex-1 space-y-2 p-4 overflow-y-auto">
        {questions.map((question, index) => {
          const answer = answers[index];
          const isActive = question.id === activeQuestion.id;
          const isAnswered = answer !== null;
          const isCorrect = isAnswered && answer === question.answer;

          return (
            <div
              key={question.id}
              className={cn(
                "p-3 border rounded-md transition-all cursor-pointer",
                isActive
                  ? "bg-custom-accent/20 border-custom-accent"
                  : "bg-secondary hover:bg-secondary/80 border-border",
              )}
              onClick={() => onSelect(question, index)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">Q{index + 1}</span>
                  {isAnswered && mode === "tutor" && (
                    <div
                      className={cn(
                        "flex justify-center items-center rounded-full w-5 h-5 text-xs",
                        isCorrect
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white",
                      )}
                    >
                      {isCorrect ? <Check size={12} /> : <X size={12} />}
                    </div>
                  )}
                </div>
                {isAnswered && (
                  <span className="text-muted-foreground text-xs">
                    {answer?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

