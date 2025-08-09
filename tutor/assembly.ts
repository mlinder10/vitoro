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

// --- Retry + timeout support ---

export class TimeoutError extends Error {
  constructor(msg = "LLM step timed out") {
    super(msg);
    this.name = "TimeoutError";
  }
}

export class ValidationError extends Error {
  constructor(msg = "Model JSON failed schema validation") {
    super(msg);
    this.name = "ValidationError";
  }
}

export interface RetryOptions {
  timeoutMs?: number; // Default 15000
  maxRetries?: number; // Default 1
  backoffMs?: number; // Default 400
  onRetryAdjust?: (info: {
    attempt: number;
    planStep: StepPlan["step"];
    lastError: unknown;
    previousSystem: string;
    previousUser: string;
  }) => Partial<{ system: string; user: string }> | void;
  onRetry?: (info: { attempt: number; error: unknown }) => void;
  fallbackFactory?: () => StepResult<any>;
}

async function streamWithTimeout(
  streamFn: (system: string, user: string) => AsyncIterable<string>,
  system: string,
  user: string,
  timeoutMs: number
): Promise<string> {
  let buffer = "";
  let timedOut = false;

  const timer = setTimeout(() => {
    timedOut = true;
  }, timeoutMs);

  try {
    for await (const chunk of streamFn(system, user)) {
      if (timedOut) throw new TimeoutError();
      buffer += chunk;
    }
  } finally {
    clearTimeout(timer);
  }

  return buffer;
}

function makeTwoPartStreamer(llm: LLM) {
  return async function* (system: string, user: string): AsyncGenerator<string> {
    for await (const chunk of llm.stream([
      { type: "text", content: system },
      { type: "text", content: user },
    ] as any)) {
      yield chunk;
    }
  };
}

export async function runStepWithRetry<T = StepOutput>(
  llm: LLM,
  plan: StepPlan,
  ctx: RunContext,
  opts: RetryOptions = {}
): Promise<StepResult<T>> {
  const {
    timeoutMs = 15_000,
    maxRetries = 1,
    backoffMs = 400,
    onRetryAdjust,
    onRetry,
    fallbackFactory,
  } = opts;

  const tpl = await loadTemplate(plan.step);
  let { system, user } = assembleStepPayload(plan, ctx, tpl);

  const streamer = makeTwoPartStreamer(llm);

  let attempt = 0;
  let lastErr: unknown;

  while (attempt <= maxRetries) {
    try {
      const raw = await streamWithTimeout(streamer, system, user, timeoutMs);
      const parsed: any = safeParseModelJSON(raw);
      validateAgainstSchema(parsed, (tpl as any).response_schema);

      return {
        step: plan.step,
        focusConcepts: plan.focusConcepts,
        citations: plan.citations ?? [],
        output: parsed as T,
      };
    } catch (err) {
      lastErr = err;
      if (attempt === maxRetries) break;

      onRetry?.({ attempt: attempt + 1, error: err });

      const wait = backoffMs * Math.pow(2, attempt) + Math.floor(Math.random() * 100);
      await new Promise((r) => setTimeout(r, wait));

      const adj = onRetryAdjust?.({
        attempt: attempt + 1,
        planStep: plan.step,
        lastError: err,
        previousSystem: system,
        previousUser: user,
      });
      if (adj?.system) system = adj.system;
      if (adj?.user) user = adj.user;

      attempt += 1;
      continue;
    }
  }

  if (fallbackFactory) return fallbackFactory();
  throw (lastErr instanceof Error ? lastErr : new Error(String(lastErr)));
}

export function defaultRetryAdjust(info: {
  attempt: number;
  planStep: StepPlan["step"];
  previousSystem: string;
  previousUser: string;
}) {
  if (info.attempt === 1) {
    const extra = [
      "\nCRITICAL: Output ONLY a single valid JSON object. No explanations. No code fences.",
      "If unsure, return the minimal object that satisfies `response_schema.required`.",
    ].join("\n");
    return { system: info.previousSystem + extra };
  }
  if (info.attempt >= 2) {
    try {
      const user = JSON.parse(info.previousUser);
      const minimal = {
        schema: user.schema,
        step: user.step,
        focusConcepts: user.focusConcepts,
        citations: user.citations,
        question: {
          stem: user.question?.stem,
          options: user.question?.options,
          chosenIndex: user.question?.chosenIndex,
        },
      };
      return { user: JSON.stringify(minimal) };
    } catch {
      // ignore
    }
  }
  return {};
}


