"use client";

import GradientTitle from "@/components/gradient-title";
import SessionRow from "./session-row";
import { QBankSession } from "@/types";
import { useState } from "react";

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
    <div className="flex flex-col items-center gap-8 p-8">
      <GradientTitle text="History" className="font-bold text-4xl" />
      <div className="flex flex-col gap-4 w-full">
        {sessions.map((s) => (
          <SessionRow
            key={s.id}
            session={s}
            onNameChange={handleNameChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
