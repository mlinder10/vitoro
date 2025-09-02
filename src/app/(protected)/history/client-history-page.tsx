"use client";

import GradientTitle from "@/components/gradient-title";
import SessionRow from "./session-row";
import { QBankSession } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History } from "lucide-react";

type ClientHistoryPageProps = {
  sessions: QBankSession[];
};

export default function ClientHistoryPage({
  sessions: s,
}: ClientHistoryPageProps) {
  const [sessions, setSessions] = useState(s);

  function handleNameChange(id: string, name: string) {
    const newSessions = sessions.map((s) => {
      if (s.id === id) return { ...s, name };
      return s;
    });
    setSessions(newSessions);
  }

  function handleDelete(id: string) {
    const newSessions = sessions.filter((s) => s.id !== id);
    setSessions(newSessions);
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8 h-full">
      <GradientTitle text="History" className="font-bold text-4xl" />
      <div className="flex flex-col flex-1 gap-4 w-full">
        {sessions.map((s) => (
          <SessionRow
            key={s.id}
            session={s}
            onNameChange={handleNameChange}
            onDelete={handleDelete}
          />
        ))}
        {sessions.length === 0 && <EmptyHistoryView />}
      </div>
    </div>
  );
}

function EmptyHistoryView() {
  return (
    <div className="flex-1 place-items-center grid">
      <div className="flex flex-col items-center gap-6 bg-card shadow-sm p-10 border border-border rounded-2xl max-w-md text-center">
        <div className="bg-accent/10 p-4 rounded-full">
          <History className="w-10 h-10 text-accent" />
        </div>
        <p className="font-semibold text-xl">No sessions found</p>
        <p className="max-w-sm text-muted-foreground text-sm">
          You don&apos;t have any previous or ongoing practice sessions. Start
          one now to begin tracking your progress.
        </p>
        <Button asChild variant="accent" size="lg" className="mt-2">
          <Link href="/practice">Start a Session</Link>
        </Button>
      </div>
    </div>
  );
}
