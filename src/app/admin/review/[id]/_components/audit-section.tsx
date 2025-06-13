"use client";

import { CHECKLIST } from "@/lib/constants";
import { ParsedAudit, AuditRating } from "@/lib/types";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleUpdateAuditStatus } from "../actions";
import { Button } from "@/components/ui/button";

type AuditSectionProps = {
  audit: ParsedAudit | null;
};

export default function AuditSection({ audit }: AuditSectionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function updateAuditStatus(rating: AuditRating) {
    if (!audit) return;
    setIsLoading(true);
    await handleUpdateAuditStatus(audit.questionId, rating);
    setIsLoading(false);
    router.refresh();
  }

  function renderAuditStatus() {
    switch (audit?.rating) {
      case "Pass":
        return (
          <p className="bg-green-500 m-2 py-2 border-2 border-green-700 rounded-md text-green-950 text-center">
            Passed
          </p>
        );
      case "Flag for Human Review":
        return (
          <p className="bg-yellow-300 m-2 py-2 border-2 border-yellow-500 rounded-md text-yellow-800 text-center">
            Flagged
          </p>
        );
      case "Reject":
        return (
          <p className="bg-red-500 m-2 py-2 border-2 border-red-700 rounded-md text-red-950 text-center">
            Rejected
          </p>
        );
    }
  }

  function renderSuggestions() {
    if (audit?.suggestions.length === 0) {
      return (
        <p className="py-4 text-muted-foreground text-center">No suggestions</p>
      );
    }

    return (
      <ul className="pl-4 list-disc">
        {audit?.suggestions.map((suggestion, index) => (
          <li key={index} className="text-muted-foreground text-sm">
            {suggestion}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="flex-1/4 space-y-4 bg-secondary border-l-2 overflow-y-auto">
      {renderAuditStatus()}
      <ul>
        {Object.entries(audit?.checklist || {}).map(([index, item]) => (
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
      {renderSuggestions()}
      {audit?.rating === "Flag for Human Review" && (
        <div className="flex gap-2 p-2">
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
      )}
    </section>
  );
}
