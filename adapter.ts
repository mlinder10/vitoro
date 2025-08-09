// tutor/adapters.ts
import type { Question as AppQuestion, QuestionChoice } from "@/types";
import type { Question as EngineQuestion, Attempt, StudentProfile } from "@/tutor/models";

export function toEngineQuestion(q: AppQuestion): EngineQuestion {
  // Adjust these mappings to your real field names:
  return {
    id: q.id,
    stem: q.prompt ?? q.stem ?? q.text,
    options: q.choices.map((c: QuestionChoice) => c.text),
    correctIndex: q.choices.findIndex((c: QuestionChoice) => c.id === q.correctChoiceId),
    tags: q.tags ?? [],                // optional: ["endocrine","DKA","acid-base"]
    nbmePattern: q.nbmePattern ?? undefined
  };
}

export function makeAttempt(params: {
  userId: string;
  q: AppQuestion;
  clickedChoiceId: string;
  freeTextWhy?: string;
}): Attempt {
  const chosenIndex = params.q.choices.findIndex(c => c.id === params.clickedChoiceId);
  return {
    userId: params.userId,
    questionId: params.q.id,
    chosenIndex,
    freeTextWhy: params.freeTextWhy,
    submittedAt: new Date().toISOString()
  };
}

export function ensureProfile(userId: string, existing?: Partial<StudentProfile>): StudentProfile {
  return {
    userId,
    mastery: existing?.mastery ?? {},
    traps: existing?.traps ?? {},
    lastSeenConcepts: existing?.lastSeenConcepts ?? []
  };
}
