"use client";

import {
  StepTwoFoundationalFollowup,
  StepTwoFoundationalQuestion,
} from "@/types";

type ClientStepTwoFoundationalReviewPageProps = {
  question: StepTwoFoundationalQuestion;
  followUps: StepTwoFoundationalFollowup[];
};

export default function ClientStepTwoFoundationalReviewPage({
  question,
  followUps,
}: ClientStepTwoFoundationalReviewPageProps) {
  return (
    <div>
      <p>{question.question}</p>
      <p>{followUps.length}</p>
    </div>
  );
}
