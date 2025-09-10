import { NBMEQuestion, QBankSession, QuestionChoice, LabValue } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import QuestionChoiceView from "./question-choice";
import { cn } from "@/lib/utils";
import HighlightableText from "@/components/highlightable-text";

type QuestionCardProps = {
  session: QBankSession;
  question: NBMEQuestion;
  answers: (QuestionChoice | null)[];
  flaggedIds: string[];
  index: number;
  onBack: () => void;
  onNext: (isChecked: boolean) => void;
  onSubmit: (choice: QuestionChoice) => Promise<void>;
  onFlag: () => Promise<void>;
  onUnflag: () => Promise<void>;
  /**
   * When true, the question card stretches to fill available width.
   * Used in tutor mode before an answer is submitted so the prompt
   * occupies the full container, similar to timed mode.
   */
  fullWidth?: boolean;
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
  onFlag,
  onUnflag,
  fullWidth = false,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<QuestionChoice | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const labsByPanel = question.labValues
    ? question.labValues.reduce<Record<string, LabValue[]>>((acc, lab) => {
        (acc[lab.panel] ||= []).push(lab);
        return acc;
      }, {})
    : {};
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
    setSubmissionLoading(false);
    if (session.mode === "timed") {
      onNext(true);
    } else {
      if (isAtEnd) onNext(true);
      setIsChecked(true);
    }
  }

  useEffect(() => {
    const existing = answers[index];
    setSelected(existing);
    setSubmissionLoading(false);
    setIsChecked(session.mode === "tutor" && existing !== null);
  }, [question, answers, index, session.mode]);

  return (
    <div
      className={cn(
        "flex flex-col gap-8 bg-tertiary p-8 border rounded-md h-full overflow-y-auto",
        session.mode === "tutor"
          ? fullWidth
            ? "flex-1 w-full"
            : "flex-2 max-w-[800px]"
          : "flex-1 w-full"
      )}
    >
      <HighlightableText
        text={question.question}
        storageKey={`nbme-${question.id}`}
        className="leading-relaxed"
      />

      {question.labValues && question.labValues.length > 0 && (
        <div className="bg-secondary p-4 rounded-md">
          <h3 className="mb-2 font-semibold">Laboratory Values:</h3>
          <table className="w-full text-sm border border-border border-collapse">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-2 border border-border font-medium">
                  Analyte
                </th>
                <th className="px-3 py-2 border border-border text-right font-medium">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {question.labValues.map((lab, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2 border border-border">{lab.analyte}</td>
                  <td className="px-3 py-2 border border-border text-right">
                    {lab.value} {lab.unit} {lab.qual}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
