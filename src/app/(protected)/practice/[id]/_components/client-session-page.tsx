"use client";

import { Button } from "@/components/ui/button";
import { NBMEQuestion, QBankSession, QuestionChoice } from "@/types";
import { Calculator, Clipboard, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  answerQuestion,
  endSession,
  updateFlaggedQuestions,
} from "../../actions";
import { useSession } from "@/contexts/session-provider";
import ChatCard from "./chat-card";
import QuestionNavigator from "./question-navigator";
import QuestionCard from "./question-card";
import { motion, AnimatePresence } from "framer-motion";

type ClientSessionPageProps = {
  session: QBankSession;
  questions: NBMEQuestion[];
};

export default function ClientSessionPage({
  session,
  questions,
}: ClientSessionPageProps) {
  const { id } = useSession();
  const [answers, setAnswers] = useState<(QuestionChoice | null)[]>(
    session.answers
  );
  const [flaggedIds, setFlaggedIds] = useState<string[]>(
    session.flaggedQuestionIds
  );
  const [showSidebar, setShowSidebar] = useState(session.mode === "tutor");
  const [activeIndex, setActiveIndex] = useState(0);
  const activeQuestion = questions[activeIndex];
  const router = useRouter();

  function handleBack() {
    if (activeIndex < 1) return;
    setActiveIndex((prev) => prev - 1);
  }

  function handleNext(isChecked: boolean) {
    if (session.mode === "timed" && !isChecked) return;

    if (
      (session.mode === "timed" && !answers.slice(0, -1).includes(null)) ||
      (session.mode === "tutor" && !answers.includes(null))
    )
      return handleEndSession();

    for (let i = 1; i < session.questionIds.length; i++) {
      const index = activeIndex + (i % session.questionIds.length);
      if (answers[index] === null) return setActiveIndex(index);
    }
  }

  async function handleSubmit(choice: QuestionChoice) {
    const copy = [...answers];
    copy[activeIndex] = choice;
    setAnswers(copy);
    await answerQuestion({
      userId: id,
      questionId: activeQuestion.id,
      sessionId: session.id,
      answer: choice,
      answers: copy,
    });
  }

  async function handleEndSession() {
    await endSession(session.id);
    router.push(`/practice/${session.id}/summary`);
  }

  async function handleFlagQuestion() {
    const copy = [...flaggedIds];
    copy.push(activeQuestion.id);
    setFlaggedIds(copy);
    await updateFlaggedQuestions(session.id, copy);
  }

  async function handleUnflagQuestion() {
    const copy = [...flaggedIds];
    copy.splice(copy.indexOf(activeQuestion.id), 1);
    setFlaggedIds(copy);
    await updateFlaggedQuestions(session.id, copy);
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        canToggleSidebar={session.mode === "tutor"}
        onToggleSidebar={() => setShowSidebar((prev) => !prev)}
      />
      <div className="flex flex-1 h-full overflow-hidden">
        <AnimatePresence initial={false}>
          {showSidebar && (
            <motion.div
              key="sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="h-full"
            >
              <QuestionNavigator
                questions={questions}
                answers={answers}
                activeQuestion={activeQuestion}
                onSelect={(_, i) => setActiveIndex(i)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-1 gap-8 p-8 h-full">
          <QuestionCard
            session={session}
            question={activeQuestion}
            answers={answers}
            flaggedIds={flaggedIds}
            index={activeIndex}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
            onTimeOut={handleEndSession}
            onFlag={handleFlagQuestion}
            onUnflag={handleUnflagQuestion}
          />
          {answers[activeIndex] !== null && (
            <ChatCard question={activeQuestion} choice={answers[activeIndex]} />
          )}
        </div>
      </div>
    </div>
  );
}

type HeaderProps = {
  canToggleSidebar: boolean;
  onToggleSidebar: () => void;
};

function Header({ canToggleSidebar, onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex justify-between p-4 border-b">
      {canToggleSidebar ? (
        <Button variant="outline" onClick={onToggleSidebar}>
          <Menu />
        </Button>
      ) : (
        <div />
      )}
      <div className="flex gap-4">
        <Button variant="outline">
          <Calculator />
          <span>Calculator</span>
        </Button>
        <Button variant="outline">
          <Clipboard />
          <span>Lab Values</span>
        </Button>
      </div>
    </header>
  );
}
