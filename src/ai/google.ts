import { LLM, Prompt } from "./llm";
import { GoogleGenAI } from "@google/genai";

type GeminiModel =
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-lite"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite";

const DEFAULT_MODEL: GeminiModel = "gemini-2.0-flash";

type GeminiInput = {
  role: string;
  parts: (
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  )[];
};

export class Gemini implements LLM {
  private ai;
  private model;

  constructor(model: GeminiModel = DEFAULT_MODEL) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    this.model = model;
  }

  private createInput(prompt: Prompt[]): GeminiInput[] {
    return prompt.map((p) => {
      if (p.type === "text") {
        return {
          role: p.role ?? "user",
          parts: [{ text: p.content }],
        };
      } else if (p.type === "image") {
        return {
          role: p.role ?? "user",
          parts: [
            {
              inlineData: {
                mimeType: p.mimeType,
                data: Buffer.from(p.content).toString("base64"),
              },
            },
          ],
        };
      } else {
        throw new Error("Unknown prompt type");
      }
    });
  }

  async prompt(prompt: Prompt[]) {
    const input = this.createInput(prompt);
    const res = await this.ai.models.generateContent({
      model: this.model,
      contents: input,
    });

    const output =
      res.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("") ?? "";

    if (!output) throw new Error("No text output from Gemini");

    const inputTokens = res.usageMetadata?.promptTokenCount ?? 0;
    const outputTokens = res.usageMetadata?.candidatesTokenCount ?? 0;

    return { text: output, inputTokens, outputTokens };
  }

  async *promptStreamed(prompt: Prompt[]) {
    const input = this.createInput(prompt);
    const stream = await this.ai.models.generateContentStream({
      model: this.model,
      contents: input,
    });

    for await (const chunk of stream) {
      if (chunk.text === undefined) {
        throw new Error("Failed to generate text");
      }
      const inputTokens = chunk.usageMetadata?.promptTokenCount ?? 0;
      const outputTokens = chunk.usageMetadata?.candidatesTokenCount ?? 0;
      yield { text: chunk.text, inputTokens, outputTokens };
    }
  }
}
