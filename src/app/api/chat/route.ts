import { Gemini } from "@/ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const llm = new Gemini();
  const res = llm.promptStreamed([{ type: "text", content: prompt }]);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of res) {
        controller.enqueue(encoder.encode(chunk)); // or `.text`, `.content`, etc
      }
      controller.close();
    },
  });

  return new Response(stream);
}
