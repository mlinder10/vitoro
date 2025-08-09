import type { StepPlan } from "../model";
import type { Question as EngQ, Attempt } from "../model";
import { loadTemplate, type StepTemplate } from "./templates";
import type { LLM } from "./llm";
import Ajv from "ajv";

export type RunContext = {
  question: EngQ;
  attempt: Attempt;
  retrieved?: Array<{ id: string; title?: string; snippet?: string }>;
};

import type { StepOutput } from "./step_outputs";

export type StepResult<TOutput = StepOutput> = {
  step: StepPlan["step"];
  focusConcepts: string[];
  citations: string[];
  output: TOutput;
};

function makeSystemPrompt(systemRules: string[]): string {
  return [
    "You are Vito. Return ONLY valid JSON matching the response_schema.",
    ...systemRules,
  ].join("\n");
}

export function assembleStepPayload(
  sp: StepPlan,
  ctx: RunContext,
  tpl: StepTemplate
) {
  const system = makeSystemPrompt(tpl.system_rules);
  const userObj = {
    step: sp.step,
    focusConcepts: sp.focusConcepts,
    citations: sp.citations ?? [],
    schema: tpl.response_schema,
    question: {
      id: ctx.question.id,
      stem: ctx.question.stem,
      options: ctx.question.options,
      correctIndex: ctx.question.correctIndex,
      tags: ctx.question.tags ?? [],
      nbmePattern: ctx.question.nbmePattern ?? null,
    },
    attempt: {
      chosenIndex: ctx.attempt.chosenIndex,
      freeTextWhy: ctx.attempt.freeTextWhy ?? null,
    },
    retrieved: ctx.retrieved ?? [],
  };
  const user = JSON.stringify(userObj);
  return { system, user };
}

const ajv = new Ajv({ allErrors: true, strict: false });

export function safeParseModelJSON(output: string): unknown {
  const stripped = output
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  try {
    return JSON.parse(stripped);
  } catch {
    return { error: "NON_JSON_OUTPUT", raw: stripped };
  }
}

export function validateAgainstSchema(output: any, schema: Record<string, unknown>) {
  const validate = ajv.compile(schema);
  if (!validate(output)) {
    throw new Error("Schema validation failed: " + JSON.stringify(validate.errors));
  }
}

export async function runStep(llm: LLM, sp: StepPlan, ctx: RunContext): Promise<StepResult> {
  const tpl = await loadTemplate(sp.step);
  const { system, user } = assembleStepPayload(sp, ctx, tpl);

  let full = "";
  for await (const chunk of llm.stream([
    { type: "text", content: system },
    { type: "text", content: user },
  ] as any)) {
    full += chunk;
  }

  const parsed: any = safeParseModelJSON(full);
  const schema = (tpl as StepTemplate).response_schema as any;
  if (schema) validateAgainstSchema(parsed, schema);

  return {
    step: sp.step,
    focusConcepts: sp.focusConcepts,
    citations: sp.citations ?? [],
    output: parsed as StepOutput,
  };
}

export async function runStepWithGuardrails(
  llm: LLM,
  sp: StepPlan,
  ctx: RunContext,
  opts: { timeoutMs?: number } = {}
): Promise<StepResult> {
  const timeoutMs = opts.timeoutMs ?? 20000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await runStep(llm, sp, ctx);
  } catch (err) {
    return {
      step: sp.step,
      focusConcepts: sp.focusConcepts,
      citations: sp.citations ?? [],
      output: {
        error: "FALLBACK",
        message: "Sorry, retrying that explanation soon.",
        detail: (err as Error)?.message,
      } as unknown as StepOutput,
    };
  } finally {
    clearTimeout(timeout);
  }
}


