import fs from "node:fs";
import path from "node:path";
import type { ReasoningStepName } from "@/tutor/models";

/** Template file metadata & schema */
export interface StepTemplate {
  name: ReasoningStepName;
  system_rules: string[];
  response_schema: Record<string, unknown>; // JSON Schema
}

/** Map steps -> filenames in tutor/templates */
const TEMPLATE_MAP: Record<ReasoningStepName, string> = {
  DIAGNOSE_MISTAKE:     "step_diagnose.json",
  EXPLAIN_KEY_CONCEPT:  "step_explain.json",
  CONTRAST_DISTRACTORS: "step_contrast.json",
  APPLY_VARIATION:      "step_apply_variation.json",
  SOCRATIC_PROBE:       "step_probe.json",
  SUMMARIZE_TAKEAWAY:   "step_summarize.json",
};

export function loadTemplate(step: ReasoningStepName): StepTemplate {
  const filename = TEMPLATE_MAP[step];
  const p = path.resolve(process.cwd(), "tutor", "templates", filename);
  const raw = fs.readFileSync(p, "utf-8");
  const parsed = JSON.parse(raw) as StepTemplate;
  return parsed;
}
