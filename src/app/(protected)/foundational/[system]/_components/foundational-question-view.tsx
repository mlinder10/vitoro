"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FoundationalFollowup,
  FoundationalQuestion,
  QuestionChoice,
  FoundationalFollowupAnswer,
} from "@/types";
import {
  submitShortResponse,
  submitFollowupAnswer,
  completeFoundationalQuestion,
} from "../actions";
import QuestionChoiceView from "../../../practice/[id]/_components/question-choice";
import HighlightableText from "@/components/highlightable-text";

// Shared progress bar -------------------------------------------------------

type ProgressBarProps = {
  current: number;
  total: number;
};

function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-indigo-400 to-purple-600 transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// Base component ------------------------------------------------------------

type FoundationalQuestionBaseProps = {
  question: FoundationalQuestion;
  index: number;
  total: number;
  onAnswered: (answer: string) => void;
  onNext: () => void;
  showNext?: boolean;
  initialResponse?: string;
};

export function FoundationalQuestionBase({
  question,
  index,
  total,
  onAnswered,
  onNext,
  showNext = false,
  initialResponse,
}: FoundationalQuestionBaseProps) {
  const [response, setResponse] = useState(initialResponse ?? "");
  const [showAnswer, setShowAnswer] = useState(Boolean(initialResponse));

  async function handleSubmit() {
    await submitShortResponse(question.id, response);
    setShowAnswer(true);
    onAnswered(response);
  }

  if (showAnswer)
    return (
      <div className="space-y-4 bg-card text-card-foreground p-6 rounded-lg shadow border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Question {index} of {total}
          </span>
        </div>
        <HighlightableText
          text={question.question}
          storageKey={`found-${question.id}`}
          className="text-lg font-medium mb-2"
        />
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="font-semibold">Your Answer</p>
            <div className="bg-muted p-3 rounded-md">{response}</div>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Expected Answer</p>
            <div className="p-3 rounded-md text-white text-center bg-gradient-to-r from-blue-400 to-cyan-400">
              {question.expectedAnswer}
            </div>
          </div>
        </div>
        {showNext && <Button onClick={onNext}>Next</Button>}
      </div>
    );

  return (
    <div className="space-y-4 bg-card text-card-foreground p-6 rounded-lg shadow border">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Question {index} of {total}
        </span>
      </div>
      <HighlightableText
        text={question.question}
        storageKey={`found-${question.id}`}
        className="text-lg font-medium"
      />
      <Textarea value={response} onChange={(e) => setResponse(e.target.value)} />
      <Button onClick={handleSubmit} disabled={!response}>
        Submit
      </Button>
    </div>
  );
}

// Follow up component -------------------------------------------------------

type FoundationalQuestionFollowupProps = {
  question: FoundationalFollowup;
  questionId: string;
  answers: FoundationalFollowupAnswer[];
  index: number;
  total: number;
  onAnswered: (answer: FoundationalFollowupAnswer) => void;
  onNext: () => void;
  showNext?: boolean;
  initialAnswer?: QuestionChoice | null;
};

export function FoundationalQuestionFollowup({
  question,
  questionId,
  answers,
  index,
  total,
  onAnswered,
  onNext,
  showNext = true,
  initialAnswer = null,
}: FoundationalQuestionFollowupProps) {
  const [selected, setSelected] = useState<QuestionChoice | null>(initialAnswer);
  const [isChecked, setIsChecked] = useState(Boolean(initialAnswer));
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!selected || isChecked) return;
    setLoading(true);
    await submitFollowupAnswer({
      questionId,
      followupId: question.id,
      answers,
      answer: selected,
      total: total - 1,
    });
    setLoading(false);
    setIsChecked(true);
    onAnswered({ id: question.id, answer: selected });
  }

  return (
    <div className="space-y-4 bg-card text-card-foreground p-6 rounded-lg shadow border">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{question.type}</span>
        <span className="text-sm text-muted-foreground">
          Question {index} of {total}
        </span>
      </div>
      <HighlightableText
        text={question.question}
        storageKey={`found-${questionId}-${question.id}`}
        className="text-lg font-medium"
      />
      <ul className="flex flex-col gap-4">
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
              select={setSelected}
              isLoading={loading}
              isChecked={isChecked}
            />
          );
        })}
      </ul>
      {isChecked ? (
        showNext ? (
          <Button onClick={onNext}>Next</Button>
        ) : null
      ) : (
        <Button onClick={handleSubmit} disabled={selected === null || loading}>
          Submit
        </Button>
      )}
    </div>
  );
}

// Flow component -------------------------------------------------------------

type FoundationalQuestionFlowProps = {
  question: FoundationalQuestion;
  followups: FoundationalFollowup[];
  initialAnswer?: {
    shortResponse: string;
    answers: FoundationalFollowupAnswer[];
  } | null;
};

export function FoundationalQuestionFlow({
  question,
  followups,
  initialAnswer,
}: FoundationalQuestionFlowProps) {
  const [shortResponse, setShortResponse] = useState(initialAnswer?.shortResponse ?? "");
  const [answers, setAnswers] = useState<FoundationalFollowupAnswer[]>(
    initialAnswer?.answers ?? []
  );
  const initialVisible = followups.slice(0, answers.length + (shortResponse ? 1 : 0));
  const [visibleFollowups, setVisibleFollowups] = useState<FoundationalFollowup[]>(initialVisible);
  const [current, setCurrent] = useState(
    shortResponse ? Math.min(answers.length + 2, 1 + followups.length) : 1
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const total = 1 + followups.length;
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleFollowups.length]);

  function handleBaseAnswered(ans: string) {
    setShortResponse(ans);
  }

  function handleBaseNext() {
    if (followups.length > 0) {
      setCurrent((c) => Math.min(c + 1, total));
      setVisibleFollowups([followups[0]]);
    } else {
      setCurrent(total);
      completeFoundationalQuestion(question.id).then(() => {
        setIsComplete(true);
      });
    }
  }

  function handleFollowupAnswered(ans: FoundationalFollowupAnswer) {
    setAnswers((prev) => [...prev, ans]);
  }

  const router = useRouter();

  function showNextFollowup() {
    const nextIndex = visibleFollowups.length;
    if (nextIndex < followups.length) {
      setVisibleFollowups(followups.slice(0, nextIndex + 1));
      setCurrent((c) => Math.min(c + 1, total));
    } else {
      setCurrent(total);
      completeFoundationalQuestion(question.id).then(() => {
        setIsComplete(true);
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-background p-4">
        <ProgressBar current={current} total={total} />
      </div>
      <div className="space-y-6">
        <FoundationalQuestionBase
          question={question}
          index={1}
          total={total}
          onAnswered={handleBaseAnswered}
          onNext={handleBaseNext}
          initialResponse={shortResponse}
          showNext={!isComplete && (followups.length === 0 || visibleFollowups.length === 0)}
        />
        {visibleFollowups.map((f, idx) => (
          <FoundationalQuestionFollowup
            key={f.id}
            question={f}
            questionId={question.id}
            answers={answers}
            index={idx + 2}
            total={total}
            onAnswered={handleFollowupAnswered}
            onNext={showNextFollowup}
            showNext={!isComplete}
            initialAnswer={answers.find((a) => a.id === f.id)?.answer ?? null}
          />
        ))}
        {isComplete && (
          <div className="space-y-4 bg-card text-card-foreground p-6 rounded-lg shadow border text-center">
            <p className="text-lg font-medium">🎉 Case Complete!</p>
            <Button onClick={() => router.refresh()}>Next</Button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
