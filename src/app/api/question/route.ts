// import { fetchF } from "@/app/(protected)/practice/actions";

// export async function POST(request: Request) {
//   const { userId } = await request.json();

//   if (!userId) return new Response("Missing user ID", { status: 400 });

//   const question = await fetchUnansweredQuestion(userId);
//   if (!question) return new Response("No question found", { status: 404 });

//   return new Response(JSON.stringify(question));
// }
