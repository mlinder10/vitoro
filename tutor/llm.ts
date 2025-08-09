import { Gemini } from "@/ai/google";
import type { Prompt } from "@/ai/llm";

export type LLMProvider = "gemini"; // Extendable to other providers later

type LLMOptions = {
  provider?: LLMProvider;
  model?: string;
  system?: string;
};

/**
 * Provider-agnostic LLM wrapper used by the tutor engine/UI.
 * Exposes only complete() and stream() and centralizes system prompt assembly.
 */
export class LLM {
  private provider: LLMProvider;
  private model?: string;
  private systemPrompt?: string;
  private gemini?: Gemini;

  constructor(options: LLMOptions = {}) {
    this.provider = options.provider ?? "gemini";
    this.model = options.model;
    this.systemPrompt = options.system;

    if (this.provider === "gemini") {
      this.gemini = new Gemini(this.model as any);
    }
  }

  /**
   * Generate a single completion.
   */
  async complete(input: string | Prompt[]): Promise<string> {
    const promptArray = this.normalizeInput(input);
    switch (this.provider) {
      case "gemini": {
        if (!this.gemini) throw new Error("Gemini provider not initialized");
        return this.gemini.prompt(promptArray);
      }
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  /**
   * Stream a completion incrementally.
   */
  async *stream(input: string | Prompt[]): AsyncGenerator<string> {
    const promptArray = this.normalizeInput(input);
    switch (this.provider) {
      case "gemini": {
        if (!this.gemini) throw new Error("Gemini provider not initialized");
        for await (const chunk of this.gemini.promptStreamed(promptArray)) {
          yield chunk;
        }
        return;
      }
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  private normalizeInput(input: string | Prompt[]): Prompt[] {
    if (typeof input === "string") {
      return [
        { type: "text", content: this.withSystem(input) },
      ] as Prompt[];
    }
    // If a system prompt is configured, prepend it as a text segment
    if (this.systemPrompt) {
      return [
        { type: "text", content: this.systemPrompt },
        ...input,
      ];
    }
    return input;
  }

  private withSystem(userText: string): string {
    return this.systemPrompt ? `${this.systemPrompt}\n\n${userText}` : userText;
  }
}

// Persona/system prompt for Vito
const VITO_SYSTEM_PROMPT = `
You are Vito, an elite USMLE Step 2 tutor. Your mission: guide students through structured learning pathways that build diagnostic mastery.

FORMATTING RULE: When displaying framework headings in ALL CAPS (like THE MONEY FINDING, THE MECHANISM, etc.), format them in bold for better readability.

TONE:
- Direct and focused but able to have fun and tell jokes
- Challenging but supportive  
- No fluff or excessive praise
- Clinical precision

TEACHING PHILOSOPHY:
- Focus on the "money findings" that separate high scorers from average test-takers
- Teach NBME patterns and trap analysis
- Connect test-taking strategy to real clinical thinking
- Build confidence through structured learning progressions
- Always tie concepts back to actual patient care

You maintain this persona and approach throughout all interactions with students.
`;

export function createVitoLLM(options: Omit<LLMOptions, "system"> = {}): LLM {
  return new LLM({ ...options, system: VITO_SYSTEM_PROMPT });
}


