import { ResponsesModel } from "openai/resources/shared.mjs";
import { LLM, Prompt } from "./llm";
import OpenAI from "openai";

type ChatGPTModel = ResponsesModel;

const DEFAULT_MODEL: ChatGPTModel = "chatgpt-4o-latest";

export class ChatGPT implements LLM {
  private ai;
  private model;

  constructor(model: ChatGPTModel = DEFAULT_MODEL) {
    this.ai = new OpenAI();
    this.model = model;
  }

  private createInput(prompt: Prompt[]) {
    return prompt.map((p) => {
      if (p.type === "text") {
        return {
          type: "input_text",
          text: p.content,
        } as const;
      } else if (p.type === "image") {
        return {
          type: "input_file",
          file_data: p.content.toString(), // TODO: convert to base64
        } as const;
      } else {
        throw new Error("Unknown prompt type");
      }
    });
  }

  async prompt(prompt: Prompt[]) {
    const response = await this.ai.responses.create({
      model: this.model,
      input: [
        {
          role: "user",
          content: this.createInput(prompt),
        },
      ],
    });
    return response.output_text;
  }

  async *promptStreamed(prompt: Prompt[]) {
    const stream = await this.ai.responses.create({
      model: this.model,
      input: [
        {
          role: "user",
          content: this.createInput(prompt),
        },
      ],
      stream: true,
    });
    for await (const chunk of stream) {
      // TODO: make sure this is the right type
      if (chunk.type !== "response.output_text.done")
        throw new Error("Failed to generate text");
      yield chunk.text;
    }
  }
}
