import { Audit } from "@prisma/client";

export type ChecklistItem = { pass: boolean; notes: string };

export type AuditStatus = "Pass" | "Flag for Human Review" | "Reject";

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
  rating: AuditStatus;
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

export function encodeAudit(audit: ParsedAudit): Audit {
  return {
    ...audit,
    checklist: JSON.stringify(audit.checklist),
    suggestions: JSON.stringify(audit.suggestions),
  };
}

export function parseAudit(encoded: Audit): ParsedAudit {
  return {
    ...encoded,
    checklist: JSON.parse(encoded.checklist),
    suggestions: JSON.parse(encoded.suggestions),
    rating: encoded.rating as AuditStatus,
  };
}
