export type ReasoningStepName =
  | "DIAGNOSE_MISTAKE"
  | "EXPLAIN_KEY_CONCEPT"
  | "CONTRAST_DISTRACTORS"
  | "APPLY_VARIATION"
  | "SOCRATIC_PROBE"
  | "SUMMARIZE_TAKEAWAY";

export interface Question {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  tags?: string[];         // e.g., ["cards","HFpEF","physiology"]
  nbmePattern?: string;    // e.g., "lab-borderline-trap"
}

export interface Attempt {
  userId: string;
  questionId: string;
  chosenIndex: number;
  freeTextWhy?: string;
  submittedAt: string;     // ISO
}

export interface ErrorSignature {
  stage: "recognition" | "discrimination" | "calculation" | "prioritization" | "interpretation";
  trap?: string;
  confidence?: number;     // 0..1
}

export interface StepPlan {
  step: ReasoningStepName;
  focusConcepts: string[];
  notes?: Record<string,string>;
  citations?: string[];
}

export interface StudentProfile {
  userId: string;
  mastery: Record<string, number>;    // concept -> 0..1
  traps: Record<string, number>;      // trap -> count
  lastSeenConcepts: string[];
}
