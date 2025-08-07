"use client";

import { QBankSession, Question } from "@/types";
import { useState } from "react";
import QuestionView from "../../../questions/_components/question-view";
import QuestionsList from "../../../questions/_components/questions-list";

type QuestionsSummaryWrapperProps = {
  session: QBankSession;
  questions: Question[];
};

export default function QuestionsSummaryWrapper({
  session,
  questions,
}: QuestionsSummaryWrapperProps) {
  const [index, setIndex] = useState(0);
  const question = questions[index];

  // TODO: handle flagging

  async function handleNextQuestion() {
    if (index === questions.length - 1) return setIndex(0);
    setIndex((prev) => prev + 1);
  }

  return (
    <div className="flex h-full">
      <QuestionsList
        questions={questions}
        answers={session.answers}
        flagged={session.flaggedQuestionIds}
        setFlagged={() => {}}
        index={index}
        setIndex={setIndex}
      />
      <QuestionView
        mode={"tutor"}
        time={null}
        question={question}
        isLoading={false}
        isChecked={true}
        selection={session.answers[index]}
        setSelection={() => {}}
        handleNextQuestion={handleNextQuestion}
        handleSubmit={() => {}}
      />
    </div>
  );
}
