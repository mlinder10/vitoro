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

  function handleAnswerBase() {}

  function handleAnswerFollowUp() {}

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
  onAnswer: (answer: string) => void;
};

function BaseQuestionView({ question }: BaseQuestionViewProps) {
  return <div>{question.question}</div>;
}

// Follow Ups Questions

type FollowUpQuestionViewProps = {
  followUp: StepOneFoundationalFollowup;
  onAnswer: (answer: QuestionChoice) => void;
};

function FollowUpQuestionView({ followUp }: FollowUpQuestionViewProps) {
  return <div>{followUp.question}</div>;
}
