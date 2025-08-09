import { ErrorSignature, StudentProfile } from "./models";

export function updateMastery(profile: StudentProfile, concept: string, errors: ErrorSignature[]) {
  const delta = errors.length ? -0.05 : 0.03;
  const prev = profile.mastery[concept] ?? 0.5;
  profile.mastery[concept] = Math.max(0, Math.min(1, prev + delta));
  for (const e of errors) if (e.trap) profile.traps[e.trap] = (profile.traps[e.trap] ?? 0) + 1;
  profile.lastSeenConcepts = [concept, ...profile.lastSeenConcepts.filter(c => c !== concept)].slice(0, 10);
  return profile;
}
