"use client";

import QuestionChoiceView from "@/app/(protected)/practice/[id]/_components/question-choice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AnsweredStepOneFoundational,
  QuestionChoice,
  StepOneFoundationalFollowup,
  StepOneFoundationalQuestion,
} from "@/types";
import { useEffect, useRef, useState } from "react";
import ProgressBar from "../../_components/progress-bar";
import HighlightableText from "@/components/highlightable-text";
// import { answerStepOneQuestion } from "../../actions";

type ClientStepOneFoundationalPageProps = {
  userId: string;
  question: StepOneFoundationalQuestion;
  followUps: StepOneFoundationalFollowup[];
  answer: AnsweredStepOneFoundational | null;
};

export function ClientStepOneFoundationalPage({
  userId,
  question,
  followUps,
  answer: originalAnswer,
}: ClientStepOneFoundationalPageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [answer, setAnswer] = useState(originalAnswer);
  const [isLoading, setIsLoading] = useState(false);
  const [baseAnswer, setBaseAnswer] = useState<string | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<QuestionChoice[]>(
    Array(followUps.length).fill(null)
  );

  async function handleAnswerBase(ans: string) {
    const copy: AnsweredStepOneFoundational = answer
      ? { ...answer }
      : {
          id: crypto.randomUUID(),
          step: "Step 1",
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
    // await answerStepOneQuestion(copy, answer !== null);
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
    // await answerStepOneQuestion(copy, true);
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
  question: StepOneFoundationalQuestion;
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

  // TODO: add next button after submit
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
        {finalAnswer && (
          <div>
            <p className="text-muted-foreground text-sm">Expected Answer:</p>
            <p>{question.diagnosis}</p>
          </div>
        )}
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

// Follow Ups Questions

type FollowUpQuestionViewProps = {
  index: number;
  total: number;
  followUp: StepOneFoundationalFollowup;
  finalAnswer: QuestionChoice | null;
  isLoading: boolean;
  onNext: (answer: QuestionChoice) => Promise<void>;
};

function FollowUpQuestionView({
  index,
  total,
  followUp,
  finalAnswer,
  isLoading,
  onNext,
}: FollowUpQuestionViewProps) {
  const [selected, setSelected] = useState<QuestionChoice | null>(finalAnswer);
  const [isChecked, setIsChecked] = useState(finalAnswer !== null);

  function handleAnswer() {
    setIsChecked(true);
  }

  async function handleNext() {
    if (!selected) return;
    await onNext(selected);
  }

  return (
    <section className="flex flex-col py-8 h-full">
      <div className="flex flex-col flex-1 gap-8 bg-tertiary mx-auto p-8 border rounded-md max-w-[800px]">
        <p className="font-semibold text-custom-accent text-lg">
          Question {index + 2} of {total}
        </p>

        <HighlightableText
          text={followUp.question}
          storageKey={`foundational-${followUp.id}`}
        />

        <div className="flex flex-col gap-4 mt-auto">
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
                isLoading={isLoading}
                isChecked={isChecked}
              />
            );
          })}
        </div>

        <div className="flex justify-between">
          <div />

          {!isChecked && (
            <Button
              variant="accent"
              onClick={handleAnswer}
              disabled={selected === null || isChecked}
            >
              Submit
            </Button>
          )}
          {isChecked && !finalAnswer && (
            <Button variant="accent" onClick={handleNext} disabled={isLoading}>
              Next
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
