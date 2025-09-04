import { cn } from "@/lib/utils";
import { NBMEQuestion, QuestionChoice } from "@/types";
import { Check, X } from "lucide-react";

type PlaygroundNavigatorProps = {
  questions: NBMEQuestion[];
  answers: (QuestionChoice | null)[];
  activeQuestion: NBMEQuestion;
  onSelect: (question: NBMEQuestion, index: number) => void;
};

export default function PlaygroundNavigator({
  questions,
  answers,
  activeQuestion,
  onSelect,
}: PlaygroundNavigatorProps) {
  return (
    <nav className="flex flex-col bg-tertiary border-r w-[300px] h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Question Navigator</h2>
        <p className="text-muted-foreground text-sm">
          {answers.filter((a) => a !== null).length} of {questions.length} answered
        </p>
      </div>
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {questions.map((question, index) => {
          const answer = answers[index];
          const isActive = question.id === activeQuestion.id;
          const isAnswered = answer !== null;
          const isCorrect = isAnswered && answer === question.answer;

          return (
            <div
              key={question.id}
              className={cn(
                "p-3 border rounded-md cursor-pointer transition-all",
                isActive
                  ? "bg-custom-accent/20 border-custom-accent"
                  : "bg-secondary hover:bg-secondary/80 border-border"
              )}
              onClick={() => onSelect(question, index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    Q{index + 1}
                  </span>
                  {isAnswered && (
                    <div className={cn(
                      "flex items-center justify-center w-5 h-5 rounded-full text-xs",
                      isCorrect 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                    )}>
                      {isCorrect ? <Check size={12} /> : <X size={12} />}
                    </div>
                  )}
                </div>
                {isAnswered && (
                  <span className="text-xs text-muted-foreground">
                    {answer?.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {question.topic}
              </p>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
