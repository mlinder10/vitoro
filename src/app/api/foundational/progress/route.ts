import { answeredFoundationals, db } from "@/db";
import { getSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { questionId, completed, total } = await request.json();

  if (!questionId || typeof completed !== "number" || typeof total !== "number") {
    return new Response("Invalid payload", { status: 400 });
  }

  const { id } = await getSession();

  await db
    .update(answeredFoundationals)
    .set({ isComplete: completed >= total })
    .where(
      and(
        eq(answeredFoundationals.userId, id),
        eq(answeredFoundationals.foundationalQuestionId, questionId)
      )
    );

  return new Response(null, { status: 204 });
}
