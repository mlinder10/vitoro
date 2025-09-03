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
import { useRouter } from "next/navigation";

// Base component ------------------------------------------------------------

type FoundationalQuestionBaseProps = {
  question: FoundationalQuestion;
};

export function FoundationalQuestionBase({
  question,
}: FoundationalQuestionBaseProps) {
  const [response, setResponse] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    await submitShortResponse(question.id, response);
    setShowAnswer(true);
  }

  if (showAnswer)
    return (
      <div className="space-y-4">
        <p>{question.question}</p>
        <div>
          <p className="font-semibold">Expected Answer</p>
          <p>{question.expectedAnswer}</p>
        </div>
        <Button onClick={() => router.refresh()}>Next</Button>
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
  const router = useRouter();

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
        <Button onClick={() => router.refresh()}>Next</Button>
      ) : (
        <Button onClick={handleSubmit} disabled={selected === null || loading}>
          Submit
        </Button>
      )}
    </div>
  );
}
