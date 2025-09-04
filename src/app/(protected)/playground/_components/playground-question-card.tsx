import { NBMEQuestion, QuestionChoice } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import PlaygroundQuestionChoice from "@/app/(protected)/playground/_components/playground-question-choice";

type PlaygroundQuestionCardProps = {
  question: NBMEQuestion;
  answers: (QuestionChoice | null)[];
  index: number;
  totalQuestions: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: (choice: QuestionChoice) => void;
};

export default function PlaygroundQuestionCard({
  question,
  answers,
  index,
  totalQuestions,
  onBack,
  onNext,
  onSubmit,
}: PlaygroundQuestionCardProps) {
  const [selected, setSelected] = useState<QuestionChoice | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const canGoBack = index > 0;
  const canGoNext = index < totalQuestions - 1;
  const currentAnswer = answers[index];

  async function handleSubmit() {
    if (!selected) return;
    onSubmit(selected);
    setIsChecked(true);
  }

  useEffect(() => {
    // Reset state when question changes
    setSelected(currentAnswer);
    setIsChecked(currentAnswer !== null);
  }, [question, currentAnswer]);

  return (
    <div className="flex flex-col flex-2 gap-8 bg-tertiary p-8 border rounded-md max-w-[800px] h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-custom-accent text-lg">
          Question {index + 1} of {totalQuestions}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Topic: {question.topic}</span>
        </div>
      </div>

      <p className="leading-relaxed">{question.question}</p>

      {/* Lab Values Section */}
      {question.labValues && question.labValues.length > 0 && (
        <div className="bg-secondary p-4 rounded-md">
          <h3 className="font-semibold mb-2">Laboratory Values:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {question.labValues.map((lab, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{lab.analyte}:</span>
                <span>
                  {lab.value} {lab.unit} {lab.qual}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {Object.entries(question.choices).map(([l]) => {
          const letter = l as QuestionChoice;
          return (
            <PlaygroundQuestionChoice
              key={letter}
              letter={letter}
              choice={question.choices[letter]}
              explanation={question.explanations[letter]}
              isCorrect={question.answer === letter}
              isSelected={selected === letter}
              select={setSelected}
              isChecked={isChecked}
            />
          );
        })}
      </div>

      <div className="flex justify-between mt-auto">
        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} disabled={!canGoBack}>
            <ChevronLeft />
            <span>Back</span>
          </Button>

          <Button variant="outline" onClick={onNext} disabled={!canGoNext}>
            <span>Next</span>
            <ChevronRight />
          </Button>
        </div>
        <div className="flex gap-4">
          <Button
            variant="accent"
            onClick={handleSubmit}
            disabled={selected === null}
          >
            {isChecked ? "Update Answer" : "Submit Answer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
