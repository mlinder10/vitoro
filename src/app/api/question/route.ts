import { fetchUnansweredQuestion } from "@/app/(protected)/practice/actions";

export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) return new Response("Missing user ID", { status: 400 });

  const question = await fetchUnansweredQuestion(userId);
  return new Response(JSON.stringify(question));
}
