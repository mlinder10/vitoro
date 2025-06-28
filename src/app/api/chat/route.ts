import { promptGeminiStreamed } from "@/llm/gemini";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const res = await promptGeminiStreamed(prompt);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of res.stream) {
        controller.enqueue(encoder.encode(chunk.text())); // or `.text`, `.content`, etc
      }
      controller.close();
    },
  });

  return new Response(stream);
}
