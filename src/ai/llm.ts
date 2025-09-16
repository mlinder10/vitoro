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
