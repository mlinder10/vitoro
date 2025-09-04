"use client";

import { useState } from "react";
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
import { useNavigationGuard } from "@/hooks/use-navigation-guard";

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
  const completed = showAnswer ? 1 : 0;
  const { refresh } = useNavigationGuard(question.id, completed, total);

  async function handleSubmit() {
    await submitShortResponse(question.id, response);
    setShowAnswer(true);
  }

  function handleNext() {
    refresh();
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

  const completed = 1 + answers.length + (isChecked ? 1 : 0);
  const totalWithBase = total + 1;
  const { refresh } = useNavigationGuard(questionId, completed, totalWithBase);

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
        <Button onClick={() => refresh()}>
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
