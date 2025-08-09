export type StepTemplate = {
  name: string;
  system_rules: string[];
  response_schema: unknown;
};

export async function loadTemplate(step: string): Promise<StepTemplate> {
  switch (step) {
    case "EXPLAIN_KEY_CONCEPT":
      return (await import("./step_explain.json")) as unknown as StepTemplate;
    case "CONTRAST_DISTRACTORS":
      return (await import("./step_contrast.json")) as unknown as StepTemplate;
    case "SOCRATIC_PROBE":
      return (await import("./step_probe.json")) as unknown as StepTemplate;
    case "DIAGNOSE_MISTAKE":
      return (await import("./step_diagnose.json")) as unknown as StepTemplate;
    case "APPLY_VARIATION":
      return (await import("./step_apply_variation.json")) as unknown as StepTemplate;
    case "SUMMARIZE_TAKEAWAY":
      return (await import("./step_summarize.json")) as unknown as StepTemplate;
    default:
      throw new Error(`No template for step: ${step}`);
  }
}


