export type Prompt = { role: "user" | "assistant" } & (
  | TextPrompt
  | ImagePrompt
);

export type TextPrompt = {
  type: "text";
  content: string;
};

export type ImagePrompt = {
  type: "image";
  mimeType: string;
  content: Uint8Array;
};

export type LLM = {
  prompt: (prompt: Prompt[]) => Promise<string>;
  promptStreamed: (prompt: Prompt[]) => AsyncGenerator<string>;
};

export function stripAndParse<T>(output: string): T | null {
  if (typeof output !== "string") return null;
  const stripped = output.replace("```json", "").replace("```", "").trim();
  try {
    const parsed = JSON.parse(stripped);
    return parsed as T;
  } catch (err) {
    console.error(err);
    return null;
  }
}
