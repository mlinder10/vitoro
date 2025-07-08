import { db, questions } from "@/db";

export async function GET() {
  try {
    const res = await db.update(questions).set({ rating: "Pass" });
    return new Response(JSON.stringify(res), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
