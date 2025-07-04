import { audits } from "@/db";
import { InferSelectModel } from "drizzle-orm";

export type Audit = InferSelectModel<typeof audits>;
export type ChecklistItem = { pass: boolean; notes: string };

export type AuditRating = "Pass" | "Flag for Human Review" | "Reject";

export type Checklist = {
  1: ChecklistItem;
  2: ChecklistItem;
  3: ChecklistItem;
  4: ChecklistItem;
  5: ChecklistItem;
  6: ChecklistItem;
  7: ChecklistItem;
  8: ChecklistItem;
  9: ChecklistItem;
};

export type GeneratedAudit = {
  checklist: {
    1: ChecklistItem;
    2: ChecklistItem;
    3: ChecklistItem;
    4: ChecklistItem;
    5: ChecklistItem;
    6: ChecklistItem;
    7: ChecklistItem;
    8: ChecklistItem;
    9: ChecklistItem;
  };
  suggestions: string[];
  rating: AuditRating;
};

export type ParsedAudit = GeneratedAudit & {
  id: string;
  questionId: string;
};

export function isValidGeneratedAudit(audit: GeneratedAudit) {
  return (
    typeof audit === "object" &&
    typeof audit.checklist === "object" &&
    isValidChecklistItem(audit.checklist["1"]) &&
    isValidChecklistItem(audit.checklist["2"]) &&
    isValidChecklistItem(audit.checklist["3"]) &&
    isValidChecklistItem(audit.checklist["4"]) &&
    isValidChecklistItem(audit.checklist["5"]) &&
    isValidChecklistItem(audit.checklist["6"]) &&
    isValidChecklistItem(audit.checklist["7"]) &&
    isValidChecklistItem(audit.checklist["8"]) &&
    isValidChecklistItem(audit.checklist["9"]) &&
    Array.isArray(audit.suggestions) &&
    ["Pass", "Flag for Human Review", "Reject"].includes(audit.rating)
  );
}

function isValidChecklistItem(checklistItem: ChecklistItem) {
  return (
    typeof checklistItem === "object" &&
    typeof checklistItem.pass === "boolean" &&
    typeof checklistItem.notes === "string"
  );
}
