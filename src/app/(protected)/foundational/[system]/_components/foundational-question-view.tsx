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
} from "../actions";
import QuestionChoiceView from "../../../practice/[id]/_components/question-choice";

// Shared progress bar -------------------------------------------------------

type ProgressBarProps = {
  current: number;
  total: number;
};

function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  return (
    <div className="mb-6 text-center">
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Question {current} of {total}
      </p>
    </div>
  );
}

// Base component ------------------------------------------------------------

type FoundationalQuestionBaseProps = {
  question: FoundationalQuestion;
  total: number;
  onAnswered: (answer: string) => void;
  initialResponse?: string;
};

export function FoundationalQuestionBase({
  question,
  total,
  onAnswered,
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
        <ProgressBar current={1} total={total} />
        <p className="text-lg font-medium mb-2">{question.question}</p>
        <div className="space-y-1">
          <p className="font-semibold">Your Answer</p>
          <p>{response}</p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold">Expected Answer</p>
          <p>{question.expectedAnswer}</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-4 bg-card text-card-foreground p-6 rounded-lg shadow border">
      <ProgressBar current={1} total={total} />
      <p className="text-lg font-medium">{question.question}</p>
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
  current: number;
  total: number;
  onAnswered: (answer: FoundationalFollowupAnswer) => void;
  onNext: () => void;
};

export function FoundationalQuestionFollowup({
  question,
  questionId,
  answers,
  current,
  total,
  onAnswered,
  onNext,
}: FoundationalQuestionFollowupProps) {
  const [selected, setSelected] = useState<QuestionChoice | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!selected) return;
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

  const current = 2 + answers.length; // includes base question
  return (
    <div className="space-y-4 bg-card text-card-foreground p-6 rounded-lg shadow border">
      <ProgressBar current={current} total={total} />
      <p className="text-lg font-medium">{question.question}</p>
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
        <Button onClick={onNext}>Next</Button>
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
  const [showBaseAnswer, setShowBaseAnswer] = useState(Boolean(shortResponse));
  const [answers, setAnswers] = useState<FoundationalFollowupAnswer[]>(
    initialAnswer?.answers ?? []
  );
  const [visibleFollowups, setVisibleFollowups] = useState<FoundationalFollowup[]>(
    followups.slice(0, answers.length + (showBaseAnswer ? 1 : 0))
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const total = 1 + followups.length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleFollowups.length, showBaseAnswer]);

  function handleBaseAnswered(ans: string) {
    setShortResponse(ans);
    setShowBaseAnswer(true);
    if (visibleFollowups.length === 0 && followups.length > 0) {
      setVisibleFollowups([followups[0]]);
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
    } else {
      router.refresh();
    }
  }

  return (
    <div className="space-y-6 overflow-y-auto">
      <FoundationalQuestionBase
        question={question}
        total={total}
        onAnswered={handleBaseAnswered}
        initialResponse={shortResponse}
      />
      {visibleFollowups.map((f, idx) => (
        <FoundationalQuestionFollowup
          key={f.id}
          question={f}
          questionId={question.id}
          answers={answers}
          current={2 + idx}
          total={total}
          onAnswered={handleFollowupAnswered}
          onNext={showNextFollowup}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
