"use client";

import { Button } from "@/components/ui/button";
import { NBMEQuestion, QBankSession, QuestionChoice } from "@/types";
import { Calculator, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  answerQuestion,
  endSession,
  updateFlaggedQuestions,
} from "../../actions";
import { useSession } from "@/contexts/session-provider";
import ChatCard from "./chat/chat-card";
import QuestionNavigator from "./question-navigator";
import QuestionCard from "./question/question-card";
import Countdown from "./question/countdown";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type ClientSessionPageProps = {
  session: QBankSession;
  questions: NBMEQuestion[];
};

function ClientSessionPage({ session, questions }: ClientSessionPageProps) {
  const { id } = useSession();
  const [answers, setAnswers] = useState<(QuestionChoice | null)[]>(
    session.answers
  );
  const [flaggedIds, setFlaggedIds] = useState<string[]>(
    session.flaggedQuestionIds
  );
  const [showSidebar, setShowSidebar] = useState(session.mode === "tutor");
  const [activeIndex, setActiveIndex] = useState(0);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatFullScreen, setChatFullScreen] = useState(false);
  const activeQuestion = questions[activeIndex];
  const showChat = session.mode === "tutor" && answers[activeIndex] !== null;
  const router = useRouter();
  const isStandalone = !showSidebar && !showChat;

  useEffect(() => {
    if (showChat) setShowSidebar(false);
    if (!showChat) setChatExpanded(false);
  }, [showChat]);

  function handleChatExpand() {
    setChatFullScreen(false);
    setChatExpanded((prev) => !prev);
  }

  function handleChatFullScreen() {
    if (chatFullScreen) {
      setChatExpanded(false);
      setChatFullScreen(false);
      return;
    }
    setShowSidebar(false);
    setChatExpanded(false);
    setChatFullScreen(true);
  }

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
      step: session.step,
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
        onToggleSidebar={() => setShowSidebar((prev) => !prev)}
        current={activeIndex + 1}
        total={questions.length}
        session={session}
        onTimeOut={() => {
          handleEndSession();
        }}
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
                mode={session.mode}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div
          className={cn(
            "flex flex-1 gap-8 p-8 h-full",
            isStandalone ? "justify-center" : ""
          )}
        >
          {!chatFullScreen && (
            <motion.div
              layout
              className={cn(
                "flex transition-all duration-300",
                showChat ? "flex-2 justify-center" : "flex-1 w-full",
                isStandalone ? "justify-center max-w-6xl" : ""
              )}
            >
              <QuestionCard
                key={activeQuestion.id}
                session={session}
                question={activeQuestion}
                answers={answers}
                flaggedIds={flaggedIds}
                index={activeIndex}
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={handleSubmit}
                onFlag={handleFlagQuestion}
                onUnflag={handleUnflagQuestion}
                fullWidth={showSidebar && !showChat}
              />
            </motion.div>
          )}
          {showChat && (
            <ChatCard
              question={activeQuestion}
              choice={answers[activeIndex]}
              expanded={chatExpanded}
              fullScreen={chatFullScreen}
              onToggleExpand={handleChatExpand}
              onToggleFullScreen={handleChatFullScreen}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientSessionPage;

type HeaderProps = {
  onToggleSidebar: () => void;
  current: number;
  total: number;
  session: QBankSession;
  onTimeOut: () => void;
};

function Header({
  onToggleSidebar,
  current,
  total,
  session,
  onTimeOut,
}: HeaderProps) {
  return (
    <header className="flex items-center p-6 border-b">
      <Button
        variant="outline"
        onClick={onToggleSidebar}
        aria-label="Toggle question navigator"
      >
        <Menu />
      </Button>
      <p className="flex-1 font-semibold text-custom-accent text-lg text-center">
        Question {current} of {total}
      </p>
      <div className="flex items-center gap-4">
        {session.mode === "timed" && (
          <Countdown
            session={session}
            onEnd={onTimeOut}
            className="font-semibold"
          />
        )}
        <Button variant="outline">
          <Calculator />
          <span>Calculator</span>
        </Button>
      </div>
    </header>
  );
}
