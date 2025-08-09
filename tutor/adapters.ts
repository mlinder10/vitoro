import type { Question as AppQuestion, QuestionChoice } from "@/types";
import type { Attempt, Question as EngineQuestion, StudentProfile } from "../model";

function letterToIndex(letter: QuestionChoice): number {
  const order: QuestionChoice[] = ["a", "b", "c", "d", "e"];
  return order.indexOf(letter);
}

export function toEngineQuestion(q: AppQuestion): EngineQuestion {
  return {
    id: q.id,
    stem: (q as any).prompt ?? (q as any).stem ?? q.question,
    options: [q.choices.a, q.choices.b, q.choices.c, q.choices.d, q.choices.e],
    correctIndex: letterToIndex(q.answer),
    tags: (q as any).tags ?? (q as any).topic ? [String((q as any).topic)] : [],
    nbmePattern: (q as any).nbmePattern ?? undefined,
  };
}

export function makeAttempt(params: {
  userId: string;
  q: AppQuestion;
  clickedChoiceId: QuestionChoice;
  freeTextWhy?: string;
}): Attempt {
  const chosenIndex = letterToIndex(params.clickedChoiceId);
  return {
    userId: params.userId,
    questionId: params.q.id,
    chosenIndex,
    freeTextWhy: params.freeTextWhy,
    submittedAt: new Date().toISOString(),
  };
}

export function ensureProfile(userId: string, existing?: Partial<StudentProfile>): StudentProfile {
  return {
    userId,
    mastery: existing?.mastery ?? {},
    traps: existing?.traps ?? {},
    lastSeenConcepts: existing?.lastSeenConcepts ?? [],
  };
}


