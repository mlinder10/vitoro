import step1 from "../../Step1Foundational.json";
import step2 from "../../Step2FoundationalQuestionsFinal.json";

// Build subject -> topics map for Step 1
const subjects = new Set<string>();
const topicsMap: Record<string, Set<string>> = {};

(step1 as Array<{ subject: string; topic: string }>).forEach(({ subject, topic }) => {
  subjects.add(subject);
  if (!topicsMap[subject]) topicsMap[subject] = new Set<string>();
  topicsMap[subject].add(topic);
});

export const STEP1_SUBJECTS = Array.from(subjects).sort();
export const STEP1_TOPICS: Record<string, string[]> = Object.fromEntries(
  Object.entries(topicsMap).map(([subject, topics]) => [subject, Array.from(topics).sort()])
);

// Build shelf -> systems map for Step 2
const shelves = new Set<string>();
const systemsMap: Record<string, Set<string>> = {};

(step2 as Array<{ shelf?: string; system?: string }>).forEach(({ shelf, system }) => {
  if (!shelf) return;
  shelves.add(shelf);
  if (!systemsMap[shelf]) systemsMap[shelf] = new Set<string>();
  if (system) systemsMap[shelf].add(system);
});

export const STEP2_SHELVES = Array.from(shelves).sort();
export const STEP2_SYSTEMS: Record<string, string[]> = Object.fromEntries(
  Object.entries(systemsMap).map(([shelf, systems]) => [shelf, Array.from(systems).sort()])
);
