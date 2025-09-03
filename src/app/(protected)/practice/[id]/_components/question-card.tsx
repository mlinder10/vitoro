import { QBankSession, NBMEQuestion, QuestionChoice } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Countdown from "./countdown";
import QuestionChoiceView from "./question-choice";

type QuestionCardProps = {
  session: QBankSession;
  question: NBMEQuestion;
  answers: (QuestionChoice | null)[];
  flaggedIds: string[];
  index: number;
  onBack: () => void;
  onNext: (isChecked: boolean) => void;
  onSubmit: (choice: QuestionChoice) => Promise<void>;
  onTimeOut: () => Promise<void>;
  onFlag: () => Promise<void>;
  onUnflag: () => Promise<void>;
};

export default function QuestionCard({
  session,
  question,
  answers,
  flaggedIds,
  index,
  onBack,
  onNext,
  onSubmit,
  onTimeOut,
  onFlag,
  onUnflag,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<QuestionChoice | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const canGoBack = index > 1;
  const canGoNext =
    index < session.questionIds.length - 1 &&
    (session.mode === "tutor" || isChecked);
  const isAtEnd =
    (session.mode === "timed" && question.id === session.questionIds.at(-1)) ||
    (session.mode === "tutor" && !answers.includes(null));
  const isFlagged = flaggedIds.includes(question.id);

  async function handleSubmit() {
    if (!selected) return;
    setSubmissionLoading(true);
    await onSubmit(selected);
    setSubmissionLoading(false);
    setIsChecked(true);
    if (session.mode === "timed") onNext(true);
  }

  useEffect(() => {
    setSelected(null);
    setSubmissionLoading(false);
    setIsChecked(false);
  }, [question]);

  return (
    <div className="flex flex-col flex-2 gap-8 bg-tertiary p-8 border rounded-md max-w-[800px] h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-custom-accent text-lg">
          Question {index + 1} of {session.questionIds.length}
        </p>
        {session.mode === "timed" && (
          <Countdown
            session={session}
            onEnd={onTimeOut}
            className="text-muted-foreground"
          />
        )}
      </div>

      <p>{question.question}</p>

      <div className="flex flex-col gap-4">
        {Object.entries(question.choices).map(([l]) => {
          const letter = l as QuestionChoice;
          return (
            <QuestionChoiceView
              key={letter}
              mode={session.mode}
              letter={letter}
              choice={question.choices[letter]}
              explanation={question.explanations[letter]}
              isCorrect={question.answer === letter}
              isSelected={selected === letter}
              select={setSelected}
              isLoading={submissionLoading}
              isChecked={isChecked}
            />
          );
        })}
      </div>

      <div className="flex justify-between mt-auto">
        <div className="flex gap-4">
          {session.mode === "tutor" && (
            <>
              <Button variant="outline" onClick={onBack} disabled={!canGoBack}>
                <ChevronLeft />
                <span>Back</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => onNext(isChecked)}
                disabled={!canGoNext}
              >
                <span>Next</span>
                <ChevronRight />
              </Button>
            </>
          )}
        </div>
        <div className="flex gap-4">
          {session.mode === "tutor" &&
            (isFlagged ? (
              <Button variant="accent-light" onClick={onUnflag}>
                <span>Unmark for Review</span>
              </Button>
            ) : (
              <Button variant="accent-light" onClick={onFlag}>
                <span>Mark for Review</span>
              </Button>
            ))}
          <Button
            variant="accent"
            onClick={handleSubmit}
            disabled={
              selected === null || submissionLoading || (isChecked && !isAtEnd)
            }
          >
            {isAtEnd ? "End Session" : "Submit Answer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
