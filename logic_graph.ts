export const NBME_LOGIC_GRAPH: Record<string, {
    signals: string[];
    common_traps: string[];
    contrast_points: string[];
    probing_questions: string[];
  }> = {
    "lab-borderline-trap": {
      signals: ["value near ULN/LLN", "tempting but irrelevant lab"],
      common_traps: ["normal-range-misattribution", "anchoring-on-labs"],
      contrast_points: [
        "Borderline lab not decisive vs clinical picture",
        "Which clinical feature outweighs the lab"
      ],
      probing_questions: [
        "Which single finding would most change your dx?",
        "If this lab were normal, what would you pick and why?"
      ]
    },
    // Add more patterns as you annotate
  };
  