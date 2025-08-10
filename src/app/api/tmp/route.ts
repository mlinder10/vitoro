import { db, questions } from "@/db";

export async function GET() {
  try {
    const qs = await db.select({system: questions.system, category: questions.category, subcategory: questions.subcategory, type: questions.type}).from(questions);
    return new Response(JSON.stringify(qs), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
  }
}