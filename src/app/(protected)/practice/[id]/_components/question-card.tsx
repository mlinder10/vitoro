import { NBMEQuestion, QBankSession, QuestionChoice } from "@/types";
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
    (session.mode === "timed" && answers.length === 1) ||
    answers.at(-2) !== null ||
    (session.mode === "tutor" && !answers.includes(null));
  const isFlagged = flaggedIds.includes(question.id);

  async function handleSubmit() {
    if (!selected) return;
    setSubmissionLoading(true);
    await onSubmit(selected);
    if (session.mode === "tutor" && isAtEnd) onNext(true);
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
        <div>
          <p className="font-semibold text-custom-accent text-lg">
            Question {index + 1} of {session.questionIds.length}
          </p>
          <p className="text-muted-foreground text-sm">
            Topic: {question.topic}
          </p>
        </div>
        {session.mode === "timed" && (
          <Countdown session={session} onEnd={onTimeOut} />
        )}
      </div>

      <p className="leading-relaxed">{question.question}</p>

      {question.labValues && question.labValues.length > 0 && (
        <div className="bg-secondary p-4 rounded-md">
          <h3 className="mb-2 font-semibold">Laboratory Values:</h3>
          <div className="gap-2 grid grid-cols-2 text-sm">
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
          {/* KALEB: Changed button to not have "update answer" */}
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
