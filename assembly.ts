import { loadTemplate } from "@/tutor/templates";
import type { StepPlan, Question, Attempt } from "@/tutor/models";

/** What we send to LLM.stream() */
export interface StepLLMPayload {
  system: string;
  user: string; // stringified JSON
}

/** Parsed result we return to the caller */
export interface StepResult<T = unknown> {
  step: StepPlan["step"];
  focusConcepts: string[];
  citations: string[];
  output: T; // parsed model JSON per template schema
}

/** Build {system, user} for a given StepPlan using its template */
export function assembleStepPayload(
  plan: StepPlan,
  ctx: {
    question: Question;
    attempt: Attempt;
    retrieved?: Array<{ id: string; title: string; snippet: string }>;
  }
): StepLLMPayload {
  const tpl = loadTemplate(plan.step);

  const system = [
    "You are an expert USMLE tutor. Use NBME tone. Be concise.",
    ...tpl.system_rules,
    // Hard enforcement: JSON-only output, no pre/post text, no markdown fences
    "You MUST output a single valid JSON object that conforms exactly to the provided `response_schema`.",
    "Do NOT include code fences, explanations, or extra text—only the JSON.",
  ].join("\n");

  // Include a compact schema + grounding for the model
  const userPayload = {
    schema: tpl.response_schema,
    step: plan.step,
    focusConcepts: plan.focusConcepts,
    citations: plan.citations ?? [],
    question: {
      stem: ctx.question.stem,
      options: ctx.question.options,
      chosenIndex: ctx.attempt.chosenIndex,
    },
    grounding: (ctx.retrieved ?? []).map(d => ({
      id: d.id,
      title: d.title,
      snippet: d.snippet,
    })),
    // Room for step-specific hints (optional)
    notes: plan.notes ?? {},
  };

  return {
    system,
    user: JSON.stringify(userPayload),
  };
}

/** Helper to strip junk and parse JSON from streamed text */
export function safeParseModelJSON(raw: string): unknown {
  // Strip markdown fences or leading/trailing noise
  const trimmed = raw
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Last-ditch: find first/last braces
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first >= 0 && last > first) {
      const candidate = trimmed.slice(first, last + 1);
      return JSON.parse(candidate);
    }
    throw new Error("Model did not return valid JSON");
  }
}

/** Minimal JSON-schema validator (optional). Swap with Ajv/Zod later. */
export function shallowValidate(output: any, required: string[]): void {
  for (const key of required) {
    if (!(key in output)) {
      throw new Error(`Missing required field: ${key}`);
    }
  }
}

/** Assemble + stream + parse for one step (provider-agnostic) */
export async function runStep<T = unknown>(
  llm: { stream: (system: string, user: string) => AsyncIterable<string> },
  plan: StepPlan,
  ctx: {
    question: Question;
    attempt: Attempt;
    retrieved?: Array<{ id: string; title: string; snippet: string }>;
  }
): Promise<StepResult<T>> {
  const tpl = loadTemplate(plan.step);
  const { system, user } = assembleStepPayload(plan, ctx);

  let buf = "";
  for await (const chunk of llm.stream(system, user)) {
    buf += chunk;
  }

  const parsed: any = safeParseModelJSON(buf);

  // If the template includes a list of required props, validate those quickly
  const required = (tpl.response_schema as any)?.required as string[] | undefined;
  if (Array.isArray(required)) {
    shallowValidate(parsed, required);
  }

  return {
    step: plan.step,
    focusConcepts: plan.focusConcepts,
    citations: plan.citations ?? [],
    output: parsed as T,
  };
}
