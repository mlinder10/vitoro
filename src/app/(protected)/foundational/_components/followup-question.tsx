import HighlightableText from "@/components/highlightable-text";
import { FoundationalFollowup, QuestionChoice } from "@/types";
import { useState } from "react";
import QuestionChoiceView from "../../practice/[id]/_components/question-choice";
import { Button } from "@/components/ui/button";

type FollowUpQuestionViewProps = {
  index: number;
  total: number;
  followUp: FoundationalFollowup;
  finalAnswer: QuestionChoice | null;
  isLoading: boolean;
  onNext: (answer: QuestionChoice) => Promise<void>;
};

export default function FollowUpQuestionView({
  index,
  total,
  followUp,
  finalAnswer,
  isLoading,
  onNext,
}: FollowUpQuestionViewProps) {
  const [selected, setSelected] = useState<QuestionChoice | null>(finalAnswer);
  const [isChecked, setIsChecked] = useState(finalAnswer !== null);

  function handleAnswer() {
    setIsChecked(true);
  }

  async function handleNext() {
    if (!selected) return;
    await onNext(selected);
  }

  return (
    <section className="flex flex-col py-8 h-full">
      <div className="flex flex-col flex-1 gap-8 bg-tertiary mx-auto p-8 border rounded-md max-w-[800px]">
        <p className="font-semibold text-custom-accent text-lg">
          Question {index + 2} of {total}
        </p>

        <HighlightableText
          text={followUp.question}
          storageKey={`foundational-${followUp.id}`}
        />

        <div className="flex flex-col gap-4 mt-auto">
          {Object.entries(followUp.choices).map(([l]) => {
            const letter = l as QuestionChoice;
            return (
              <QuestionChoiceView
                key={letter}
                mode={"tutor"}
                letter={letter}
                choice={followUp.choices[letter]}
                explanation={followUp.explanations[letter]}
                isCorrect={followUp.answer === letter}
                isSelected={selected === letter}
                select={setSelected}
                isLoading={isLoading}
                isChecked={isChecked}
              />
            );
          })}
        </div>

        <div className="flex justify-between">
          <div />

          {!isChecked && (
            <Button
              variant="accent"
              onClick={handleAnswer}
              disabled={selected === null || isChecked}
            >
              Submit
            </Button>
          )}
          {isChecked && !finalAnswer && (
            <Button variant="accent" onClick={handleNext} disabled={isLoading}>
              Next
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
