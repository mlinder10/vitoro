import { FoundationalFollowup, FoundationalQuestion } from "@/types";

// Base component ------------------------------------------------------------

type FoundationalQuestionBaseProps = {
  question: FoundationalQuestion;
};

export function FoundationalQuestionBase({
  question,
}: FoundationalQuestionBaseProps) {
  return <div>{question.question}</div>;
}

// Follow up component -------------------------------------------------------

type FoundationalQuestionFollowupProps = {
  question: FoundationalFollowup;
};

export function FoundationalQuestionFollowup({
  question,
}: FoundationalQuestionFollowupProps) {
  return <div>{question.question}</div>;
}
