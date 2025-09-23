import { Gemini } from "@/ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const RequestBodySchema = z.object({
  prompts: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
      type: z.enum(["text"]),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RequestBodySchema.safeParse(body);
    if (!parsed.success) {
      console.error(parsed.error);
      return new NextResponse(null, { status: 400 });
    }

    const llm = new Gemini();
    const stream = await llm.promptStreamed(parsed.data.prompts);
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await stream.next();
          if (done) break;
          controller.enqueue(encoder.encode(JSON.stringify(value)));
        }
        controller.close();
      },
    });

    return new NextResponse(readableStream, { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(null, { status: 500 });
  }
}
