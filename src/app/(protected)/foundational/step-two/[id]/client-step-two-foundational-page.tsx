"use client";

import {
  StepTwoFoundationalQuestion,
  StepTwoFoundationalFollowup,
  AnsweredStepTwoFoundational,
  QuestionChoice,
} from "@/types";
import { useRef, useState } from "react";
import ProgressBar from "../../_components/progress-bar";
import FollowUpQuestionView from "../../_components/followup-question";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import HighlightableText from "@/components/highlightable-text";
import { answerStepTwoQuestion } from "../../actions";
import CaseComplete from "../../_components/case-complete";

type ClientStepTwoFoundationalPageProps = {
  userId: string;
  question: StepTwoFoundationalQuestion;
  followUps: StepTwoFoundationalFollowup[];
  answer: AnsweredStepTwoFoundational | null;
};

export function ClientStepTwoFoundationalPage({
  userId,
  question,
  followUps,
  answer: originalAnswer,
}: ClientStepTwoFoundationalPageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [answer, setAnswer] = useState(originalAnswer);
  const [isLoading, setIsLoading] = useState(false);
  const [baseAnswer, setBaseAnswer] = useState<string | null>(
    originalAnswer?.shortResponse ?? null
  );
  const [followUpAnswers, setFollowUpAnswers] = useState<
    (QuestionChoice | null)[]
  >(originalAnswer?.answers ?? Array(followUps.length).fill(null));

  async function handleAnswerBase(ans: string) {
    const copy: AnsweredStepTwoFoundational = answer
      ? { ...answer }
      : {
          id: crypto.randomUUID(),
          step: "Step 2",
          foundationalQuestionId: question.id,
          createdAt: new Date(),
          userId,
          shortResponse: ans,
          answers: followUpAnswers,
          isComplete: false,
        };
    copy.shortResponse = ans;

    setIsLoading(true);
    await answerStepTwoQuestion(copy, answer !== null);
    setIsLoading(false);

    setBaseAnswer(copy.shortResponse);
    setAnswer(copy);
    scrollToBottom();
  }

  async function handleAnswerFollowUp(index: number, choice: QuestionChoice) {
    if (!answer) return;
    const copy = { ...answer };
    copy.answers[index] = choice;
    setFollowUpAnswers(copy.answers);
    if (copy.answers.every((a) => a !== null)) copy.isComplete = true;
    setAnswer(copy);

    setIsLoading(true);
    await answerStepTwoQuestion(copy, true);
    setIsLoading(false);
    scrollToBottom();
  }

  function scrollToBottom() {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }

  return (
    <div className="flex flex-col h-[100vh]">
      <header className="bg-tertiary p-4 border-b">
        <ProgressBar
          current={
            (baseAnswer ? 1 : 0) +
            followUpAnswers.filter((a) => a !== null).length
          }
          total={followUps.length + 1}
        />
      </header>

      <div ref={containerRef} className="flex-1 overflow-y-auto scroll-smooth">
        <BaseQuestionView
          total={followUps.length + 1}
          question={question}
          finalAnswer={baseAnswer}
          isLoading={isLoading}
          hasFollowUps={followUps.length > 0}
          onNext={handleAnswerBase}
          onContinue={scrollToBottom}
        />
        {baseAnswer &&
          followUps.map((f, i) => {
            const shouldRender = i === 0 || followUpAnswers[i - 1] !== null;
            return (
              shouldRender && (
                <FollowUpQuestionView
                  key={f.id}
                  index={i}
                  total={followUps.length + 1}
                  followUp={f}
                  finalAnswer={followUpAnswers[i]}
                  isLoading={isLoading}
                  onNext={handleAnswerFollowUp.bind(null, i)}
                />
              )
            );
          })}
        {answer?.isComplete && (
          <CaseComplete
            step="Step 2"
            category={question.shelf}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
}

// Base Question

type BaseQuestionViewProps = {
  total: number;
  question: StepTwoFoundationalQuestion;
  finalAnswer: string | null;
  isLoading: boolean;
  hasFollowUps: boolean;
  onNext: (answer: string) => Promise<void>;
  onContinue: () => void;
};

function BaseQuestionView({
  total,
  question,
  finalAnswer,
  isLoading,
  hasFollowUps,
  onNext,
}: BaseQuestionViewProps) {
  const [answer, setAnswer] = useState(finalAnswer ?? "");
  const [isChecked, setIsChecked] = useState(finalAnswer !== null);

  function handleSubmit() {
    setIsChecked(true);
  }

  async function handleNext() {
    await onNext(answer);
  }

  function handleKeydown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <section className="flex flex-col py-8 h-full">
      <div className="flex flex-col flex-1 gap-8 bg-tertiary mx-auto p-8 border rounded-md max-w-[800px]">
        <p className="font-semibold text-custom-accent text-lg">
          Question 1 of {total}
        </p>
        <HighlightableText
          text={question.question}
          storageKey={`foundational-${question.id}`}
        />
        {isChecked ? (
          <>
            <div>
              <p className="text-muted-foreground text-sm">Your Answer:</p>
              <p>{answer}</p>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Expected Answer:</p>
              <div className="bg-gradient-to-r from-blue-400 to-cyan-400 mt-1 p-3 rounded-md text-white text-center">
                {question.expectedAnswer}
              </div>
            </div>
            {hasFollowUps && (
              <div className="flex justify-end mt-4">
                <Button variant="accent" onClick={handleNext}>
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mt-auto">
              <Textarea
                placeholder="Your Answer"
                className="h-[256px] resize-none"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeydown}
              />
            </div>
            <div className="flex justify-between">
              <div />
              <Button
                variant="accent"
                onClick={handleSubmit}
                disabled={!answer || isLoading}
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
