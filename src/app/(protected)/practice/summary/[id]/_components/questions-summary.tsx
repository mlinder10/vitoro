import { QBankSession, Question } from "@/types";
import { useState } from "react";
import QuestionView from "../../../questions/_components/question-view";
import QuestionsList from "../../../questions/_components/questions-list";
import { SUMMARY_BTN_HEIGHT } from "./summary-wrapper";

type QuestionsSummaryWrapperProps = {
  session: QBankSession;
  questions: Question[];
};

export default function QuestionsSummary({
  session,
  questions,
}: QuestionsSummaryWrapperProps) {
  const [index, setIndex] = useState(0);
  const question = questions[index];

  // TODO: handle flagging
  // TODO: handle chat history (is readonly okay?)

  async function handleNextQuestion() {
    if (index === questions.length - 1) return setIndex(0);
    setIndex((prev) => prev + 1);
  }

  return (
    <div
      className="flex"
      style={{ height: `calc(100% - ${SUMMARY_BTN_HEIGHT}px)` }}
    >
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
