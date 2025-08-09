import { describe, expect, it } from "vitest";
import { assembleStepPayload, safeParseModelJSON } from "../tutor/assembly";
import { loadTemplate } from "../tutor/templates";

describe("assembly helpers", () => {
  it("assembleStepPayload returns JSON-only contract", async () => {
    const tpl = await loadTemplate("EXPLAIN_KEY_CONCEPT");
    const { system, user } = assembleStepPayload(
      { step: "EXPLAIN_KEY_CONCEPT", focusConcepts: ["DKA"], citations: [] },
      {
        question: {
          id: "q1",
          stem: "A 23-year-old with polyuria...",
          options: ["DKA", "HHS"],
          correctIndex: 0,
          tags: [],
        } as any,
        attempt: {
          userId: "u",
          questionId: "q1",
          chosenIndex: 1,
          submittedAt: new Date().toISOString(),
        } as any,
      },
      tpl
    );
    expect(system).toMatch(/Return ONLY valid JSON/);
    const parsedUser = JSON.parse(user);
    expect(parsedUser.schema).toBeTruthy();
  });

  it("safeParseModelJSON tolerates fenced JSON", () => {
    const out = safeParseModelJSON("```json\n{\"a\":1}\n```\n");
    expect((out as any).a).toBe(1);
  });
});


