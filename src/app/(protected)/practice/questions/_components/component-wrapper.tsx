"use client";

import { useQBankSession } from "@/contexts/qbank-session-provider";
import { useSession } from "@/contexts/session-provider";
import { QuestionChoice } from "@/types";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createAnswerRecord } from "../../actions";
import QuestionsList from "./questions-list";
import QuestionView from "./question-view";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

export default function QuestionViewWrapper() {
  const { id } = useSession();
  const {
    mode,
    time,
    index,
    setIndex,
    questions,
    answers,
    setAnswers,
    flagged,
    setFlagged,
    endSession,
  } = useQBankSession();
  if (questions.length === 0) redirect("/practice");
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState<QuestionChoice | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const question = questions[index];

  async function handleSubmit() {
    if (!selection)
      return toast.info("Please select an choice", { richColors: true });
    if (mode === "timed") {
      if (time === 0) return;
      await updateAnswers(selection);
      handleNextQuestion();
    } else {
      await updateAnswers(selection);
      setIsChecked(true);
    }
  }

  async function updateAnswers(choice: QuestionChoice) {
    setIsLoading(true);
    await createAnswerRecord(id, question.id, choice);
    const newAnswers = [...answers];
    newAnswers[index] = choice;
    setAnswers(newAnswers);
    setIsLoading(false);
  }

  async function handleNextQuestion() {
    setSelection(null);
    setIsChecked(false);
    const nextIndex = getNextIndex();
    if (nextIndex !== null) return setIndex(nextIndex);
    await endSession(id);
  }

  function getNextIndex() {
    const offset = answers.slice(index + 1).findIndex((a) => a === null);
    if (offset !== -1) return index + offset + 1;
    const nextIndex = answers.findIndex((a) => a === null);
    if (nextIndex !== -1) return nextIndex;
    return null;
  }

  useEffect(() => {
    setSelection(answers[index]);
    setIsChecked(answers[index] !== null);
  }, [index, setSelection, setIsChecked, answers]);

  return (
    <div className="flex h-full">
      <QuestionsList
        questions={questions}
        answers={answers}
        flagged={flagged}
        setFlagged={setFlagged}
        index={index}
        setIndex={setIndex}
      />
      <QuestionView
        mode={mode}
        time={time}
        question={question}
        isLoading={isLoading}
        isChecked={isChecked}
        selection={selection}
        setSelection={setSelection}
        handleNextQuestion={handleNextQuestion}
        handleSubmit={handleSubmit}
      />
      <Dialog open={time === 0}>
        <DialogContent>
          <DialogTitle>Time&apos;s up!</DialogTitle>
          <DialogDescription></DialogDescription>
          <Button onClick={() => endSession(id)}>End Session</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
