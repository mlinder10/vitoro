import { db, questions, users } from "@/db";
import qs from "./batch_2.json";
import {
  AnyCategory,
  AnySubcategory,
  QuestionChoice,
  QuestionType,
  System,
} from "@/types";
import { eq, InferInsertModel } from "drizzle-orm";

export async function GET() {
  try {
    const [{ id }] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, "linder2015@outlook.com"));
    const inserts: InferInsertModel<typeof questions>[] = qs.map((q) => ({
      topic: q.topic, // Add this line
      type: q.question_type as QuestionType,
      system: q.system as System,
      category: q.category as AnyCategory,
      subcategory: q.subcategory as AnySubcategory,
      creatorId: id,
      question: q.question,
      answer: q.correct_answer.toLowerCase() as QuestionChoice,
      choices: {
        a: q.choices.A,
        b: q.choices.B,
        c: q.choices.C,
        d: q.choices.D,
        e: q.choices.E,
      },
      explanations: {
        a: q.explanation.A,
        b: q.explanation.B,
        c: q.explanation.C,
        d: q.explanation.D,
        e: q.explanation.E,
      },
      difficulty: "Moderate",
      rating: "Pass",
      sources: [],
    }));

    await db.insert(questions).values(inserts);
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
