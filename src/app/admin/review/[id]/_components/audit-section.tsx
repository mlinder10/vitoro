"use client";

import { CHECKLIST } from "@/lib/constants";
import { AuditRating, ParsedAudit, QuestionDifficulty } from "@/types";
import {
  Check,
  Pencil,
  Save,
  Undo,
  X,
  Clipboard,
  Loader,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleUpdateAuditStatus } from "../actions";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";
import { useAdminReview } from "@/contexts/admin-review-provider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AuditSection() {
  const { audit, pageType, setPageType, isSaving } = useAdminReview();

  function togglePageType() {
    setPageType((prev) => (prev === "edit" ? "review" : "edit"));
  }

  if (!audit) return null;

  return (
    <section className="flex-1/4 space-y-2 bg-secondary py-4 border-l-2 overflow-y-auto">
      <AuditStatus rating={audit.rating} />
      <div className="px-2">
        <AuditDifficulty />
      </div>
      <AuditChecklist checklist={audit.checklist} />
      <AuditSuggestions suggestions={audit.suggestions} />
      <div className="px-2">
        <Button
          className="w-full"
          variant="accent-tertiary"
          onClick={togglePageType}
          disabled={isSaving}
        >
          <span>{pageType === "edit" ? "Review" : "Edit"}</span>
          {pageType === "edit" ? <Clipboard /> : <Pencil />}
        </Button>
      </div>
      <AuditButtons />
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
        <p className="flex justify-center items-center bg-yellow-300 mx-2 border-2 border-yellow-500 rounded-md h-9 text-yellow-800 text-center">
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

function AuditDifficulty() {
  const { question, editQuestion, pageType, updateQuestion } = useAdminReview();

  if (pageType === "review") {
    return (
      <div className="flex justify-center items-center bg-background border-2 rounded-md w-full h-9">
        <p className="text-muted-foreground">
          {capitalize(question.difficulty)}
        </p>
      </div>
    );
  }

  return (
    <Select
      value={editQuestion.difficulty}
      onValueChange={(value) =>
        updateQuestion("difficulty", value as QuestionDifficulty)
      }
    >
      <SelectTrigger className="bg-background w-full text-md" center>
        <SelectValue placeholder="Select difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Difficulty</SelectLabel>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="moderate">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
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

function AuditButtons() {
  const {
    question,
    audit,
    pageType,
    hasChanges,
    revertChanges,
    saveChanges,
    isSaving,
  } = useAdminReview();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function updateAuditStatus(rating: AuditRating) {
    setIsLoading(true);
    await handleUpdateAuditStatus(question.id, rating);
    setIsLoading(false);
    router.refresh();
  }

  if (pageType === "edit") {
    return (
      <div className="flex gap-2 px-2">
        <Button
          className="flex-1"
          variant="destructive"
          disabled={!hasChanges || isSaving}
          onClick={revertChanges}
        >
          <span>Revert</span>
          <Undo />
        </Button>
        <Button
          className="flex-1"
          variant="accent"
          disabled={!hasChanges || isSaving}
          onClick={saveChanges}
        >
          <span>{isSaving ? "Saving..." : "Save"}</span>
          {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
        </Button>
      </div>
    );
  }

  if (audit?.rating === "Flag for Human Review") {
    return (
      <div className="flex gap-2 px-2">
        <Button
          className="flex-1"
          onClick={() => updateAuditStatus("Reject")}
          disabled={isLoading}
          variant="destructive"
        >
          <span>Reject</span>
          <X />
        </Button>
        <Button
          className="flex-1"
          onClick={() => updateAuditStatus("Pass")}
          disabled={isLoading}
          variant="accent"
        >
          <span>Accept</span>
          <Check />
        </Button>
      </div>
    );
  }

  return null;
}
