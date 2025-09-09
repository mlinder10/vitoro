import { QBankSession, NBMEQuestion, QuestionChoice } from "@/types";
import { useEffect, useState } from "react";
import { SUMMARY_BTN_HEIGHT } from "./client-summary-page";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateFlaggedQuestions } from "../../../actions";
import ChatCard from "../../_components/chat-card";
import QuestionNavigator from "../../_components/question-navigator";
import HighlightableText from "@/components/highlightable-text";
import QuestionChoiceView from "../../_components/question-choice";

type QuestionsSummaryWrapperProps = {
  session: QBankSession;
  questions: NBMEQuestion[];
};

export default function QuestionsSummary({
  session,
  questions,
}: QuestionsSummaryWrapperProps) {
  const [flaggedIds, setFlaggedIds] = useState<string[]>(
    session.flaggedQuestionIds
  );
  const [index, setIndex] = useState(0);
  const question = questions[index];

  async function handleNextQuestion() {
    if (index === questions.length - 1) return setIndex(0);
    setIndex((prev) => prev + 1);
  }

  async function handleFlagQuestion() {
    const copy = [...flaggedIds];
    copy.push(question.id);
    setFlaggedIds(copy);
    await updateFlaggedQuestions(session.id, copy);
  }

  async function handleUnflagQuestion() {
    const copy = [...flaggedIds];
    copy.splice(copy.indexOf(question.id), 1);
    setFlaggedIds(copy);
    await updateFlaggedQuestions(session.id, copy);
  }

  return (
    <div
      className="flex"
      style={{ height: `calc(100% - ${SUMMARY_BTN_HEIGHT}px)` }}
    >
      <QuestionNavigator
        questions={questions}
        activeQuestion={question}
        answers={session.answers}
        onSelect={(q, i) => setIndex(i)}
        mode="tutor"
      />
      <div className="flex flex-1 gap-8 p-8 h-full">
        <QuestionCard
          session={session}
          question={question}
          index={index}
          flaggedIds={flaggedIds}
          onBack={() => setIndex((prev) => prev - 1)}
          onNext={handleNextQuestion}
          onFlag={handleFlagQuestion}
          onUnflag={handleUnflagQuestion}
        />
        {session.answers[index] !== null && (
          <ChatCard question={question} choice={session.answers[index]} />
        )}
      </div>
    </div>
  );
}

type QuestionCardProps = {
  session: QBankSession;
  question: NBMEQuestion;
  flaggedIds: string[];
  index: number;
  onBack: () => void;
  onNext: () => void;
  onFlag: () => void;
  onUnflag: () => void;
};

function QuestionCard({
  session,
  question,
  flaggedIds,
  index,
  onBack,
  onNext,
  onFlag,
  onUnflag,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<QuestionChoice | null>(null);
  const canGoBack = index > 1;
  const canGoNext = index < session.questionIds.length - 1;
  const isFlagged = flaggedIds.includes(question.id);

  useEffect(() => {
    setSelected(session.answers[index]);
  }, [session, index]);

  return (
    <div className="flex flex-col flex-2 gap-8 bg-tertiary p-8 border rounded-md h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-custom-accent text-lg">
          Question {index + 1} of {session.questionIds.length}
        </p>
      </div>

      <HighlightableText
        text={question.question}
        storageKey={`nbme-${question.id}`}
      />

      <div className="flex flex-col gap-4">
        {Object.entries(question.choices).map(([l]) => {
          const letter = l as QuestionChoice;
          return (
            <QuestionChoiceView
              key={letter}
              mode="tutor"
              letter={letter}
              choice={question.choices[letter]}
              explanation={question.explanations[letter]}
              isCorrect={question.answer === letter}
              isSelected={selected === letter}
              isChecked={true}
              isLoading={false}
              select={() => {}}
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

        {isFlagged ? (
          <Button variant="accent-light" onClick={onUnflag}>
            <span>Unmark for Review</span>
          </Button>
        ) : (
          <Button variant="accent-light" onClick={onFlag}>
            <span>Mark for Review</span>
          </Button>
        )}
      </div>
    </div>
  );
}
