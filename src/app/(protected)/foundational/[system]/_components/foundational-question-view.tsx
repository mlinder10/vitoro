"use client";

import { useEffect, useState } from "react";
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
import { useRouter as useAppRouter } from "next/navigation";
import { useRouter as useLegacyRouter } from "next/router";

function sendProgress(questionId: string, completed: number, total: number) {
  if (typeof navigator === "undefined") return;
  const payload = JSON.stringify({ questionId, completed, total });
  navigator.sendBeacon("/api/foundational/progress", payload);
}

// Utility view ---------------------------------------------------------------

type FoundationalQuestionViewProps = {
  /**
   * Raw JSON questions loaded from disk or API.
   * The shape is intentionally loose because the structure of the JSON
   * payload is not enforced by the database at this stage.
   */
  questions?: Array<{ mcq_questions?: unknown[] }>;
};

export function FoundationalQuestionView({
  questions,
}: FoundationalQuestionViewProps) {
  if (!Array.isArray(questions) || questions.length === 0) {
    console.error("FoundationalQuestionView: questions failed to load or are empty");
    return <p className="text-destructive">No foundational questions available.</p>;
  }

  const invalid = questions.find(
    (q) => !Array.isArray(q.mcq_questions) || q.mcq_questions.length === 0
  );
  if (invalid) {
    console.error(
      "FoundationalQuestionView: question is missing mcq_questions array",
      invalid
    );
    return (
      <p className="text-destructive">Incomplete question data. Please try again later.</p>
    );
  }

  // Rendering is handled elsewhere – this component only validates the data.
  return null;
}

// Base component ------------------------------------------------------------

type FoundationalQuestionBaseProps = {
  question: FoundationalQuestion;
  total: number;
};

export function FoundationalQuestionBase({
  question,
  total,
}: FoundationalQuestionBaseProps) {
  const [response, setResponse] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const router = useAppRouter();
  const legacyRouter = useLegacyRouter();
  const completed = showAnswer ? 1 : 0;

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (completed < total) {
        e.preventDefault();
        e.returnValue = "";
        sendProgress(question.id, completed, total);
      }
    }

    const handleRouteChange = () => {
      if (completed < total && !confirm("Are you sure you want to leave?")) {
        throw "route change aborted";
      }
      if (completed > 0) sendProgress(question.id, completed, total);
    };

    legacyRouter.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      legacyRouter.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [completed, question.id, total, legacyRouter]);

  async function handleSubmit() {
    await submitShortResponse(question.id, response);
    setShowAnswer(true);
  }

  function handleNext() {
    sendProgress(question.id, completed, total);
    router.refresh();
  }

  if (showAnswer)
    return (
      <div className="space-y-4">
        <p>{question.question}</p>
        <div>
          <p className="font-semibold">Expected Answer</p>
          <p>{question.expectedAnswer}</p>
        </div>
        <Button onClick={handleNext}>Next</Button>
      </div>
    );

  return (
    <div className="space-y-4">
      <p>{question.question}</p>
      <Textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
      />
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
  total: number;
};

export function FoundationalQuestionFollowup({
  question,
  questionId,
  answers,
  total,
}: FoundationalQuestionFollowupProps) {
  const [selected, setSelected] = useState<QuestionChoice | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useAppRouter();
  const legacyRouter = useLegacyRouter();

  const completed = 1 + answers.length + (isChecked ? 1 : 0);
  const totalWithBase = total + 1;

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (completed < totalWithBase) {
        e.preventDefault();
        e.returnValue = "";
        sendProgress(questionId, completed, totalWithBase);
      }
    }

    const handleRouteChange = () => {
      if (completed < totalWithBase && !confirm("Are you sure you want to leave?")) {
        throw "route change aborted";
      }
      if (completed > 0) sendProgress(questionId, completed, totalWithBase);
    };

    legacyRouter.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      legacyRouter.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [completed, questionId, totalWithBase, legacyRouter]);

  async function handleSubmit() {
    if (!selected) return;
    setLoading(true);
    await submitFollowupAnswer({
      questionId,
      followupId: question.id,
      answers,
      answer: selected,
      total,
    });
    setLoading(false);
    setIsChecked(true);
  }

  return (
    <div className="space-y-4">
      <p>{question.question}</p>
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
        <Button
          onClick={() => {
            sendProgress(questionId, completed, totalWithBase);
            router.refresh();
          }}
        >
          Next
        </Button>
      ) : (
        <Button onClick={handleSubmit} disabled={selected === null || loading}>
          Submit
        </Button>
      )}
    </div>
  );
}
