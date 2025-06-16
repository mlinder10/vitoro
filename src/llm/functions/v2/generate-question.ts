import { Category, QuestionType, Subcategory, System } from "@/types";

export async function generateQuestionV2<
  S extends System,
  C extends Category<S>,
  SC extends Subcategory<S, C>,
>(system: S, category: C, subcategory: SC, type: QuestionType) {}
