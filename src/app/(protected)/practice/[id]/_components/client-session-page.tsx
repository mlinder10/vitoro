"use client";

import { Button } from "@/components/ui/button";
import { QBankMode } from "@/contexts/qbank-session-provider";
import { MINS_PER_QUESTION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { QBankSession, Question, QuestionChoice } from "@/types";
import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  answerQuestion,
  endSession,
  updateFlaggedQuestions,
} from "../../actions-new";
import { useSession } from "@/contexts/session-provider";
import ChatCard from "./chat-card";

type ClientSessionPageProps = {
  session: QBankSession;
  questions: Question[];
};

export default function ClientSessionPage({
  session,
  questions,
}: ClientSessionPageProps) {
  const { id } = useSession();
  const [answers, setAnswers] = useState<(QuestionChoice | null)[]>(
    session.answers
  );
  const [flaggedIds, setFlaggedIds] = useState<string[]>(
    session.flaggedQuestionIds
  );
  const [showSidebar, setShowSidebar] = useState(session.mode === "tutor");
  const [activeIndex, setActiveIndex] = useState(0);
  const activeQuestion = questions[activeIndex];
  const router = useRouter();

  function handleBack() {
    if (activeIndex < 1) return;
    setActiveIndex((prev) => prev - 1);
  }

  function handleNext(isChecked: boolean) {
    if (session.mode === "timed" && !isChecked) return;

    if (
      (session.mode === "timed" && !answers.slice(0, -1).includes(null)) ||
      (session.mode === "tutor" && !answers.includes(null))
    )
      return handleEndSession();

    for (let i = 1; i < session.questionIds.length; i++) {
      const index = activeIndex + (i % session.questionIds.length);
      if (answers[index] === null) return setActiveIndex(index);
    }
  }

  async function handleSubmit(choice: QuestionChoice) {
    const copy = [...answers];
    copy[activeIndex] = choice;
    setAnswers(copy);
    await answerQuestion({
      userId: id,
      questionId: activeQuestion.id,
      sessionId: session.id,
      answer: choice,
      answers: copy,
    });
  }

  async function handleEndSession() {
    await endSession(session.id);
    router.push(`/practice/${session.id}/summary`);
  }

  async function handleFlagQuestion() {
    const copy = [...flaggedIds];
    copy.push(activeQuestion.id);
    setFlaggedIds(copy);
    await updateFlaggedQuestions(session.id, copy);
  }

  async function handleUnflagQuestion() {
    const copy = [...flaggedIds];
    copy.splice(copy.indexOf(activeQuestion.id), 1);
    setFlaggedIds(copy);
    await updateFlaggedQuestions(session.id, copy);
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        canToggleSidebar={session.mode === "tutor"}
        onToggleSidebar={() => setShowSidebar((prev) => !prev)}
      />
      <div className="flex flex-1">
        {showSidebar && (
          <QuestionNavigator
            questions={questions}
            answers={answers}
            activeQuestion={activeQuestion}
            onSelect={(_, i) => setActiveIndex(i)}
          />
        )}
        <div className="flex flex-1 gap-8 p-8 h-full">
          <QuestionCard
            session={session}
            question={activeQuestion}
            answers={answers}
            flaggedIds={flaggedIds}
            index={activeIndex}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
            onTimeOut={handleEndSession}
            onFlag={handleFlagQuestion}
            onUnflag={handleUnflagQuestion}
          />
          {answers[activeIndex] !== null && (
            <ChatCard question={activeQuestion} choice={answers[activeIndex]} />
          )}
        </div>
      </div>
    </div>
  );
}

type HeaderProps = {
  canToggleSidebar: boolean;
  onToggleSidebar: () => void;
};

function Header({ canToggleSidebar, onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex justify-between p-4 border-b">
      {canToggleSidebar ? (
        <Button variant="outline" onClick={onToggleSidebar}>
          <Menu />
        </Button>
      ) : (
        <div />
      )}
      <div className="flex gap-4">
        <Button variant="outline">
          <Calculator />
          <span>Calculator</span>
        </Button>
        <Button variant="outline">
          <Clipboard />
          <span>Lab Values</span>
        </Button>
      </div>
    </header>
  );
}

type QuestionNavigatorProps = {
  questions: Question[];
  answers: (QuestionChoice | null)[];
  activeQuestion: Question;
  onSelect: (question: Question, index: number) => void;
};

export function QuestionNavigator({
  questions,
  answers,
  activeQuestion,
  onSelect,
}: QuestionNavigatorProps) {
  return (
    <section className="flex flex-col gap-8 px-4 pt-8 border-r h-full overflow-y-auto">
      <p className="font-semibold text-muted-foreground">Question Navigator</p>
      <div className="gap-2 grid grid-cols-4">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className={cn(
              "place-items-center grid bg-tertiary border rounded-md w-[40px] aspect-square cursor-pointer",
              // incorrect
              answers[i] !== null && "border-red-600 bg-red-light",
              // correct
              q.answer === answers[i] && "border-green-600 bg-green-light",
              // active
              activeQuestion.id === q.id &&
                "bg-custom-accent-light border-custom-accent"
            )}
            onClick={() => onSelect(q, i)}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </section>
  );
}

type QuestionCardProps = {
  session: QBankSession;
  question: Question;
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

function QuestionCard({
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
    <div className="flex flex-col flex-2 gap-8 bg-tertiary p-8 border rounded-md h-full">
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
            disabled={selected === null || submissionLoading || isChecked}
          >
            {isAtEnd ? "End Session" : "Submit Answer"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Question Choice

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

function QuestionChoiceView({
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

type CountdownProps = {
  session: QBankSession;
  onEnd: () => void;
  className?: string;
};

function Countdown({ session, onEnd, className }: CountdownProps) {
  const [now, setNow] = useState(Date.now());
  const [lowTime, setLowTime] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const createdAt = new Date(session.createdAt).getTime();
  const totalTime = session.questionIds.length * MINS_PER_QUESTION * 60 * 1000;
  const endTime = createdAt + totalTime;

  const timeLeft = Math.max(0, endTime - now);
  const secondsLeft = Math.floor(timeLeft / 1000);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  useEffect(() => {
    if (secondsLeft <= 0 && !isOver) {
      setIsOver(true);
      onEnd();
    }
    if (minutes < 1 && !lowTime) {
      setLowTime(true);
    }
  }, [secondsLeft, minutes, isOver, lowTime, onEnd]);

  useEffect(() => {
    if (!isOver) {
      const interval = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(interval);
    }
  }, [isOver]);

  return (
    <p className={cn(className, lowTime && "text-destructive")}>
      {`${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`}
    </p>
  );
}
