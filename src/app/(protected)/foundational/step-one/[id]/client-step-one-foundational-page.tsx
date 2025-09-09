"use client";

import QuestionChoiceView from "@/app/(protected)/practice/[id]/_components/question-choice";
import { Button } from "@/components/ui/button";
import {
  QuestionChoice,
  StepOneFoundationalFollowup,
  StepOneFoundationalQuestion,
} from "@/types";
import { useState } from "react";

type ClientStepOneFoundationalPageProps = {
  question: StepOneFoundationalQuestion;
  followUps: StepOneFoundationalFollowup[];
};

export function ClientStepOneFoundationalPage({
  question,
  followUps,
}: ClientStepOneFoundationalPageProps) {
  const [baseAnswer, setBaseAnswer] = useState("");
  const [followUpAnswers, setFollowUpAnswers] = useState<QuestionChoice[]>([]);

  console.log(baseAnswer, followUpAnswers);

  async function handleAnswerBase(answer: string) {
    setBaseAnswer(answer);
  }

  async function handleAnswerFollowUp(choice: QuestionChoice) {
    setFollowUpAnswers((prev) => [...prev, choice]);
  }

  return (
    <div>
      <BaseQuestionView question={question} onAnswer={handleAnswerBase} />
      {followUps.map((f) => (
        <FollowUpQuestionView
          key={f.id}
          followUp={f}
          onAnswer={handleAnswerFollowUp}
        />
      ))}
    </div>
  );
}

// Base Question

type BaseQuestionViewProps = {
  question: StepOneFoundationalQuestion;
  onAnswer: (answer: string) => Promise<void>;
};

function BaseQuestionView({ question }: BaseQuestionViewProps) {
  return (
    <section className="min-h-[100vh]">
      <div>
        <p>{question.question}</p>
      </div>
      <div></div>
    </section>
  );
}

// Follow Ups Questions

type FollowUpQuestionViewProps = {
  followUp: StepOneFoundationalFollowup;
  onAnswer: (answer: QuestionChoice) => Promise<void>;
};

function FollowUpQuestionView({
  followUp,
  onAnswer,
}: FollowUpQuestionViewProps) {
  const [selected, setSelected] = useState<QuestionChoice | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  async function handleAnswer() {
    if (!selected) return;
    setSubmissionLoading(true);
    await onAnswer(selected);
    setSubmissionLoading(false);
    setIsChecked(true);
  }

  return (
    <section className="flex flex-col gap-8 bg-tertiary p-8 border rounded-md max-w-[800px] min-h-[100vh]">
      <div>
        <p>{followUp.question}</p>
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(followUp.choices).map(([l]) => {
          const letter = l as QuestionChoice;
          return (
            <QuestionChoiceView
              key={letter}
              mode={"tutor"}
              letter={letter}
              choice={followUp.choices[letter]}
              explanation={followUp.explanations[letter]}
              isCorrect={followUp.answer === letter}
              isSelected={selected === letter}
              select={setSelected}
              isLoading={submissionLoading}
              isChecked={isChecked}
            />
          );
        })}
      </div>

      {!isChecked && (
        <div className="flex justify-between mt-auto ml-auto">
          <div />

          <Button
            variant="accent"
            onClick={handleAnswer}
            disabled={selected === null || submissionLoading || isChecked}
          >
            Submit
          </Button>
        </div>
      )}
    </section>
  );
}
