export interface ExplainOut { concept_summary: string; key_points: string[] }

export interface ContrastOut {
  why_correct: string;
  distractors: { option: string; why_wrong: string; contrast: string }[];
  one_line_takeaway: string;
}

export interface ProbeOut { probe: string }

export interface DiagnoseOut { failure_mode: string; evidence: string; one_line_fix: string }

export interface ApplyVariationOut {
  vignette: string;
  options: string[];
  correct_index: number;
  rationale_one_liner: string;
}

export interface SummarizeOut { takeaway: string; reminders?: string[] }

export type StepOutput =
  | ExplainOut
  | ContrastOut
  | ProbeOut
  | DiagnoseOut
  | ApplyVariationOut
  | SummarizeOut;


