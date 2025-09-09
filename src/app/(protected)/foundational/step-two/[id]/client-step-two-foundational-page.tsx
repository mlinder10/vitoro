"use client";

import {
  StepTwoFoundationalQuestion,
  StepTwoFoundationalFollowup,
  AnsweredStepTwoFoundational,
  QuestionChoice,
} from "@/types";
import { useEffect, useRef, useState } from "react";
import ProgressBar from "../../_components/progress-bar";
import FollowUpQuestionView from "../../_components/followup-question";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import HighlightableText from "@/components/highlightable-text";
import { answerStepTwoQuestion } from "../../actions";

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
  const [baseAnswer, setBaseAnswer] = useState<string | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<QuestionChoice[]>(
    Array(followUps.length).fill(null)
  );

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
    setBaseAnswer(copy.shortResponse);
    setAnswer(copy);

    setIsLoading(true);
    await answerStepTwoQuestion(copy, answer !== null);
    setIsLoading(false);
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
  }

  function scrollToBottom() {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }

  const answersDep = followUpAnswers.join("");
  useEffect(() => {
    scrollToBottom();
  }, [baseAnswer, answersDep]);

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
          onNext={handleAnswerBase}
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
  onNext: (answer: string) => Promise<void>;
};

function BaseQuestionView({
  total,
  question,
  finalAnswer,
  isLoading,
  onNext,
}: BaseQuestionViewProps) {
  const [answer, setAnswer] = useState(finalAnswer ?? "");
  const [isChecked, setIsChecked] = useState(finalAnswer !== null);

  async function handleAnswer() {
    setIsChecked(true);
  }

  async function handleNext() {
    await onNext(answer);
  }

  function handleKeydown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleAnswer();
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
          <div>
            <p className="text-muted-foreground text-sm">Your Answer:</p>
            <p>{answer}</p>
          </div>
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
                onClick={handleAnswer}
                disabled={!answer || isLoading || finalAnswer !== null}
              >
                Submit
              </Button>
            </div>
          </>
        )}

        {isChecked && !finalAnswer && (
          <div className="flex justify-between mt-auto">
            <div />
            <Button variant="accent" onClick={handleNext} disabled={isLoading}>
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
