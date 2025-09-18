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

export type LLMOutput = {
  text: string;
  inputTokens: number;
  outputTokens: number;
};

export type LLM = {
  prompt: (prompt: Prompt[]) => Promise<LLMOutput>;
  promptStreamed: (prompt: Prompt[]) => AsyncGenerator<LLMOutput>;
};
