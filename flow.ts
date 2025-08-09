import { ErrorSignature, StepPlan, StudentProfile } from "./models";

export function chooseNextSteps(
  errors: ErrorSignature[],
  profile: StudentProfile,
  concept: string,
  citations: string[]
): StepPlan[] {
  if (errors.some(e => e.stage === "recognition")) {
    return [
      { step: "EXPLAIN_KEY_CONCEPT", focusConcepts: [concept], citations },
      { step: "SOCRATIC_PROBE", focusConcepts: [concept] }
    ];
  }
  if (errors.some(e => e.stage === "discrimination")) {
    return [
      { step: "CONTRAST_DISTRACTORS", focusConcepts: [concept], citations },
      { step: "SOCRATIC_PROBE", focusConcepts: [concept] }
    ];
  }
  return [
    { step: "EXPLAIN_KEY_CONCEPT", focusConcepts: [concept], citations },
    { step: "CONTRAST_DISTRACTORS", focusConcepts: [concept], citations },
    { step: "SOCRATIC_PROBE", focusConcepts: [concept] },
    { step: "SUMMARIZE_TAKEAWAY", focusConcepts: [concept] }
  ];
}
