"use client";

import GradientTitle from "@/components/gradient-title";
import SessionRow from "./session-row";
import { QBankSession } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History, BookOpenCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type ClientHistoryPageProps = {
  sessions: QBankSession[];
  stepOneFoundationals: {
    questionId: string;
    subject: string;
    answers: (string | null)[];
  }[];
  stepTwoFoundationals: {
    questionId: string;
    shelf: string;
    answers: (string | null)[];
  }[];
};

export default function ClientHistoryPage({
  sessions: s,
  stepOneFoundationals,
  stepTwoFoundationals,
}: ClientHistoryPageProps) {
  const [sessions, setSessions] = useState(s);

  function handleNameChange(id: string, name: string) {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
  }

  function handleDelete(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="flex flex-col gap-10 p-8 h-full">
      <GradientTitle text="History" className="font-bold text-4xl" />

      {/* Practice Sessions */}
      <HistoryCard
        title="Practice Sessions"
        icon={<History className="w-6 h-6 text-accent" />}
      >
        {sessions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sessions.map((s) => (
              <SessionRow
                key={s.id}
                session={s}
                onNameChange={handleNameChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            message="No sessions yet"
            ctaLabel="Start a Session"
            href="/practice"
          />
        )}
      </HistoryCard>

      {/* Foundational Questions */}
      <HistoryCard
        title="Foundational Questions"
        icon={<BookOpenCheck className="w-6 h-6 text-accent" />}
      >
        <StepSection
          title="Step One"
          items={stepOneFoundationals.map((q) => ({
            id: q.questionId,
            label: q.subject,
            answered: 1 + q.answers.filter((a) => a !== null).length,
            total: 1 + q.answers.length,
            href: `/foundational/step-one/${q.questionId}`,
          }))}
          emptyMessage="No ongoing Step One sessions"
        />

        <StepSection
          title="Step Two"
          items={stepTwoFoundationals.map((q) => ({
            id: q.questionId,
            label: q.shelf,
            answered: 1 + q.answers.filter((a) => a !== null).length,
            total: 1 + q.answers.length,
            href: `/foundational/step-two/${q.questionId}`,
          }))}
          emptyMessage="No ongoing Step Two sessions"
        />
      </HistoryCard>
    </div>
  );
}

function HistoryCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 bg-card shadow-sm p-6 border border-border rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="bg-accent/10 p-2 rounded-lg">{icon}</div>
        <h2 className="font-semibold text-xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function StepSection({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: {
    id: string;
    label: string;
    answered: number;
    total: number;
    href: string;
  }[];
  emptyMessage: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-lg">{title}</p>
      {items.length > 0 ? (
        <div className="flex flex-col gap-2">
          {items.map((q) => (
            <Link
              key={q.id}
              href={q.href}
              className="flex justify-between items-center bg-muted hover:bg-muted/80 p-3 rounded-lg transition"
            >
              <div>
                <p className="font-medium">{q.label}</p>
                <Progress
                  value={(q.answered / q.total) * 100}
                  className="mt-1 w-40"
                />
              </div>
              <span className="text-muted-foreground text-sm">
                {q.answered}/{q.total}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">{emptyMessage}</p>
      )}
    </div>
  );
}

function EmptyCard({
  message,
  ctaLabel,
  href,
}: {
  message: string;
  ctaLabel: string;
  href: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center gap-3 bg-muted/30 p-6 rounded-xl text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button asChild variant="accent" size="sm">
        <Link href={href}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}
