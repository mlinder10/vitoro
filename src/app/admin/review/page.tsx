"use client";

import { fetchQuestions } from "@/db/question";
import useInfiniteScroll, { LoadingFooter } from "@/hooks/useInfiniteScroll";
import { AuditRating, ParsedAudit, ParsedQuestion } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

const MAX_ITEMS_PER_PAGE = 30;

export default function ReviewPage() {
  const [rating] = useState<AuditRating | undefined>(undefined);
  const {
    data: questions,
    isLoading,
    containerRef,
  } = useInfiniteScroll(
    async (offset) => fetchQuestions(offset, MAX_ITEMS_PER_PAGE, rating),
    [rating]
  );

  return (
    <main className="flex flex-col pb-2 h-page">
      <section className="px-4">{/* TODO: add inputs */}</section>
      <section className="flex-1 px-4 overflow-y-auto" ref={containerRef}>
        <ul>
          {questions.map((q) => (
            <QuestionItem key={q.question.id} qa={q} />
          ))}
          {questions.length === 0 && !isLoading && (
            <li>No flagged questions to review.</li>
          )}
        </ul>
        <LoadingFooter isLoading={isLoading} />
      </section>
    </main>
  );
}

type QuestionItemProps = {
  qa: {
    question: ParsedQuestion;
    audit: ParsedAudit | null;
  };
  isLast?: boolean;
};

function QuestionItem({ qa, isLast = false }: QuestionItemProps) {
  const { question, audit } = qa;

  function renderAuditStatus() {
    switch (audit?.rating) {
      case "Pass":
        return (
          <span className="flex items-center bg-green-500 px-4 py-1 border-2 border-green-700 rounded-md text-green-950 text-sm">
            Passed
          </span>
        );
      case "Flag for Human Review":
        return (
          <span className="flex items-center bg-yellow-300 px-4 py-1 border-2 border-yellow-500 rounded-md text-yellow-800 text-sm">
            Flagged
          </span>
        );
      case "Reject":
        return (
          <span className="flex items-center bg-red-500 px-4 py-1 border-2 border-red-700 rounded-md text-red-950 text-sm">
            Rejected
          </span>
        );
    }
  }

  return (
    <li className={cn("py-2", !isLast && "border-b-2")}>
      <Link href={`/admin/review/${question.id}`}>
        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span>{question.topic}</span>
              <span>{"-"}</span>
              <span>{question.concept}</span>
              <span>{"-"}</span>
              <span>{question.type}</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {question.createdAt.toLocaleString()}
            </p>
          </div>
          {renderAuditStatus()}
        </div>
      </Link>
    </li>
  );
}
