"use client";

import { useState } from "react";
import QuestionsSummary from "./questions-summary";
import SessionSummary from "./session-summary";
import { QBankSession, Question } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SummaryPage = "questions" | "session";

type SummaryWrapperProps = {
  session: QBankSession;
  questions: Question[];
};

export const SUMMARY_BTN_HEIGHT = 40;

export default function SummaryWrapper({
  session,
  questions,
}: SummaryWrapperProps) {
  const [page, setPage] = useState<SummaryPage>("session");

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center bg-background border-b"
        style={{ height: SUMMARY_BTN_HEIGHT }}
      >
        <Button
          variant="plain"
          onClick={() => setPage("questions")}
          className={cn(
            "flex-1 border-r font-medium text-muted-foreground",
            page === "questions" && "text-primary font-semibold"
          )}
        >
          <span>Questions</span>
        </Button>
        <Button
          variant="plain"
          onClick={() => setPage("session")}
          className={cn(
            "flex-1 font-medium text-muted-foreground",
            page === "session" && "text-primary font-semibold"
          )}
        >
          <span>Session</span>
        </Button>
      </div>
      {page === "questions" && (
        <QuestionsSummary session={session} questions={questions} />
      )}
      {page === "session" && (
        <SessionSummary session={session} questions={questions} />
      )}
    </div>
  );
}
