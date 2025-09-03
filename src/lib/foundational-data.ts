import step1 from "../../Step1Foundational.json";
import step2 from "../../Step2FoundationalQuestionsFinal.json";

// Build subject -> topics map for Step 1
const subjects = new Set<string>();
const topicsMap: Record<string, Set<string>> = {};
const subjectCounts: Record<string, number> = {};
const topicCounts: Record<string, Record<string, number>> = {};

(step1 as Array<{ subject: string; topic: string }>).forEach(({ subject, topic }) => {
  subjects.add(subject);
  subjectCounts[subject] = (subjectCounts[subject] ?? 0) + 1;
  if (!topicsMap[subject]) topicsMap[subject] = new Set<string>();
  topicsMap[subject].add(topic);
  if (!topicCounts[subject]) topicCounts[subject] = {};
  topicCounts[subject][topic] = (topicCounts[subject][topic] ?? 0) + 1;
});

export const STEP1_SUBJECTS = Array.from(subjects).sort();
export const STEP1_TOPICS: Record<string, string[]> = Object.fromEntries(
  Object.entries(topicsMap).map(([subject, topics]) => [subject, Array.from(topics).sort()])
);
export const STEP1_COUNTS = subjectCounts;
export const STEP1_TOPIC_COUNTS: Record<string, Record<string, number>> = topicCounts;

// Build shelf -> systems map for Step 2
const shelves = new Set<string>();
const systemsMap: Record<string, Set<string>> = {};
const shelfCounts: Record<string, number> = {};
const systemCounts: Record<string, Record<string, number>> = {};

(step2 as Array<{ shelf?: string; system?: string }>).forEach(({ shelf, system }) => {
  if (!shelf) return;
  shelves.add(shelf);
  shelfCounts[shelf] = (shelfCounts[shelf] ?? 0) + 1;
  if (!systemsMap[shelf]) systemsMap[shelf] = new Set<string>();
  if (system) {
    systemsMap[shelf].add(system);
    if (!systemCounts[shelf]) systemCounts[shelf] = {};
    systemCounts[shelf][system] = (systemCounts[shelf][system] ?? 0) + 1;
  }
});

export const STEP2_SHELVES = Array.from(shelves).sort();
export const STEP2_SYSTEMS: Record<string, string[]> = Object.fromEntries(
  Object.entries(systemsMap).map(([shelf, systems]) => [shelf, Array.from(systems).sort()])
);
export const STEP2_COUNTS = shelfCounts;
export const STEP2_SYSTEM_COUNTS: Record<string, Record<string, number>> = systemCounts;
const systemToShelves: Record<string, string[]> = {};
Object.entries(systemCounts).forEach(([shelf, systems]) => {
  Object.keys(systems).forEach((system) => {
    if (!systemToShelves[system]) systemToShelves[system] = [];
    systemToShelves[system].push(shelf);
  });
});

export const STEP2_SYSTEM_TO_SHELVES: Record<string, string[]> = systemToShelves;
