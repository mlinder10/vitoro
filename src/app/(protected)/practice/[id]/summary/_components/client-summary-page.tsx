"use client";

import { useState } from "react";
import { NBMEQuestion, QBankSession } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SessionSummary from "./session-summary";
import QuestionsSummary from "./questions-summary";

export const SUMMARY_BTN_HEIGHT = 64;

type SummaryPage = "questions" | "session";

type ClientSummaryPageProps = {
  session: QBankSession;
  questions: NBMEQuestion[];
};

export default function ClientSummaryPage({
  session,
  questions,
}: ClientSummaryPageProps) {
  const [page, setPage] = useState<SummaryPage>("session");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center bg-background border-b h-16">
        <Button
          variant="outline"
          onClick={() => setPage("questions")}
          className={cn(
            "flex-1 h-full rounded-none text-lg",
            page === "questions"
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground"
          )}
        >
          Questions
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage("session")}
          className={cn(
            "flex-1 h-full rounded-none text-lg",
            page === "session"
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground"
          )}
        >
          Session
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
