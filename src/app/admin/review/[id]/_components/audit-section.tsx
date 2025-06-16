"use client";

import { CHECKLIST } from "@/lib/constants";
import { AuditRating, ParsedAudit, ParsedQuestion } from "@/types";
import { Check, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleUpdateAuditStatus } from "../actions";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";
import { ReviewPageType } from "./page-wrapper";

type AuditSectionProps = {
  question: ParsedQuestion;
  audit: ParsedAudit | null;
  pageType: ReviewPageType;
  setPageType: (pageType: ReviewPageType) => void;
};

export default function AuditSection({
  question,
  audit,
  pageType,
  setPageType,
}: AuditSectionProps) {
  if (!audit) return null;

  return (
    <section className="flex-1/4 space-y-4 bg-secondary py-4 border-l-2 overflow-y-auto">
      <AuditStatus rating={audit.rating} />
      <div className="px-2">
        <div className="flex justify-center bg-background py-2 border-2 rounded-md w-full">
          <p className="text-muted-foreground">
            {capitalize(question.difficulty)} Difficulty
          </p>
        </div>
      </div>
      <AuditChecklist checklist={audit.checklist} />
      <AuditSuggestions suggestions={audit.suggestions} />
      <div className="px-2">
        <Button
          className="w-full"
          variant="accent-tertiary"
          onClick={() => setPageType("edit")}
        >
          <span>Edit</span>
          <Pencil />
        </Button>
      </div>
      <AuditButtons
        questionId={question.id}
        rating={audit.rating}
        pageType={pageType}
      />
    </section>
  );
}

function AuditStatus({ rating }: { rating: AuditRating }) {
  switch (rating) {
    case "Pass":
      return (
        <p className="bg-green-500 mx-2 py-2 border-2 border-green-700 rounded-md text-green-950 text-center">
          Passed
        </p>
      );
    case "Flag for Human Review":
      return (
        <p className="bg-yellow-300 mx-2 py-2 border-2 border-yellow-500 rounded-md text-yellow-800 text-center">
          Flagged
        </p>
      );
    case "Reject":
      return (
        <p className="bg-red-500 mx-2 py-2 border-2 border-red-700 rounded-md text-red-950 text-center">
          Rejected
        </p>
      );
  }
}

function AuditChecklist({
  checklist,
}: {
  checklist: ParsedAudit["checklist"];
}) {
  return (
    <ul>
      {Object.entries(checklist || {}).map(([index, item]) => (
        <li key={index} className="p-2 border-b-2 text-sm">
          <div className="flex items-center gap-2">
            {item.pass ? (
              <Check className="text-green-500" />
            ) : (
              <X className="text-red-500" />
            )}
            <span>
              {index}.{" "}
              {CHECKLIST[index as keyof typeof CHECKLIST] ?? "No description"}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{item.notes}</p>
        </li>
      ))}
    </ul>
  );
}

function AuditSuggestions({ suggestions }: { suggestions: string[] }) {
  if (suggestions.length === 0) {
    return (
      <p className="py-4 text-muted-foreground text-center">No suggestions</p>
    );
  }

  return (
    <ul className="pl-4">
      {suggestions.map((suggestion, index) => (
        <li key={index} className="text-muted-foreground text-sm">
          {suggestion}
        </li>
      ))}
    </ul>
  );
}

type AuditButtonsProps = {
  questionId: string;
  rating: AuditRating;
  pageType: ReviewPageType;
};

function AuditButtons({ questionId, rating, pageType }: AuditButtonsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function updateAuditStatus(rating: AuditRating) {
    setIsLoading(true);
    await handleUpdateAuditStatus(questionId, rating);
    setIsLoading(false);
    router.refresh();
  }

  if (pageType === "edit") {
    return (
      <div className="flex gap-2 px-2">
        <Button>
          <span>Discard</span>
          <X />
        </Button>
        <Button>
          <span>Save</span>
          <Check />
        </Button>
      </div>
    );
  }

  if (rating === "Flag for Human Review") {
    return (
      <div className="flex gap-2 px-2">
        <Button
          className="flex-1"
          onClick={() => updateAuditStatus("Pass")}
          disabled={isLoading}
          variant="accent"
        >
          <span>Accept</span>
          <Check />
        </Button>
        <Button
          className="flex-1"
          onClick={() => updateAuditStatus("Reject")}
          disabled={isLoading}
          variant="destructive"
        >
          <span>Reject</span>
          <X />
        </Button>
      </div>
    );
  }

  return null;
}
