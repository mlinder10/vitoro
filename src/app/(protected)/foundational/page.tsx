import PageTitle from "../_components/page-title";
import { NBME_STEPS, NBMEStep } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  STEP1_SUBJECTS,
  STEP1_TOPICS,
  STEP2_SHELVES,
  STEP2_SYSTEMS,
  STEP1_COUNTS,
  STEP1_TOPIC_COUNTS,
  STEP2_COUNTS,
  STEP2_SYSTEM_COUNTS,
  STEP2_SYSTEM_TO_SHELF,
} from "@/lib/foundational-data";
import { getSession } from "@/lib/auth";
import { answeredFoundationals, db, foundationalQuestions } from "@/db";
import { and, eq } from "drizzle-orm";

type FoundationalQuestionsPageProps = {
  searchParams: Promise<{ step?: NBMEStep; subject?: string; shelf?: string }>;
};

export default async function FoundationalQuestionsPage({
  searchParams,
}: FoundationalQuestionsPageProps) {
  const { id } = await getSession();
  const {
    step: stepParam,
    subject: subjectParam,
    shelf: shelfParam,
  } = await searchParams;
  const step: NBMEStep = stepParam ?? "Step 1";
  const decodedSubject = subjectParam
    ? decodeURIComponent(subjectParam)
    : undefined;
  const decodedShelf = shelfParam ? decodeURIComponent(shelfParam) : undefined;

  const answered = await db
    .select({
      step: foundationalQuestions.step,
      system: foundationalQuestions.system,
      topic: foundationalQuestions.topic,
    })
    .from(answeredFoundationals)
    .innerJoin(
      foundationalQuestions,
      eq(answeredFoundationals.foundationalQuestionId, foundationalQuestions.id)
    )
    .where(
      and(
        eq(answeredFoundationals.userId, id),
        eq(answeredFoundationals.isComplete, true)
      )
    );

  const answeredStep1Subjects: Record<string, number> = {};
  const answeredStep1Topics: Record<string, Record<string, number>> = {};
  const answeredStep2Shelves: Record<string, number> = {};
  const answeredStep2Systems: Record<string, number> = {};

  for (const row of answered) {
    if (row.step === "Step 1") {
      answeredStep1Subjects[row.system] =
        (answeredStep1Subjects[row.system] ?? 0) + 1;
      if (!answeredStep1Topics[row.system])
        answeredStep1Topics[row.system] = {};
      answeredStep1Topics[row.system][row.topic] =
        (answeredStep1Topics[row.system][row.topic] ?? 0) + 1;
    } else if (row.step === "Step 2") {
      answeredStep2Systems[row.system] =
        (answeredStep2Systems[row.system] ?? 0) + 1;
      const shelf = STEP2_SYSTEM_TO_SHELF[row.system];
      if (shelf)
        answeredStep2Shelves[shelf] =
          (answeredStep2Shelves[shelf] ?? 0) + 1;
    }
  }

  const renderList = (
    items: string[],
    hrefBuilder: (item: string) => string,
    counts: Record<string, { total: number; answered: number }>
  ) => (
    <div className="space-y-4 p-4">
      {items.map((item) => {
        const count = counts[item] ?? { total: 0, answered: 0 };
        return (
          <div
            key={item}
            className="relative flex justify-between items-center px-6 py-4 hover:pr-2 border rounded-md transition-all"
          >
            <div>
              <p>{item}</p>
              <p className="text-sm text-muted-foreground">
                Number available: {count.total - count.answered}/{count.total}
              </p>
              <p className="text-sm text-muted-foreground">
                Number answered: {count.answered}/{count.total}
              </p>
            </div>
            <ArrowRight size={16} className="text-muted-foreground" />
            <Link href={hrefBuilder(item)} className="absolute inset-0 opacity-0">
              {item}
            </Link>
          </div>
        );
      })}
    </div>
  );

  let content: JSX.Element;

  if (step === "Step 1") {
    if (!decodedSubject) {
      const counts = Object.fromEntries(
        STEP1_SUBJECTS.map((s) => [
          s,
          {
            total: STEP1_COUNTS[s] ?? 0,
            answered: answeredStep1Subjects[s] ?? 0,
          },
        ])
      );
      content = renderList(
        STEP1_SUBJECTS,
        (s) => `?step=${encodeURIComponent(step)}&subject=${encodeURIComponent(s)}`,
        counts
      );
    } else {
      const topics = STEP1_TOPICS[decodedSubject] ?? [];
      const counts = Object.fromEntries(
        topics.map((t) => [
          t,
          {
            total: STEP1_TOPIC_COUNTS[decodedSubject]?.[t] ?? 0,
            answered:
              answeredStep1Topics[decodedSubject]?.[t] ?? 0,
          },
        ])
      );
      content = renderList(
        topics,
        (t) =>
          `/foundational/${encodeURIComponent(decodedSubject)}?step=${encodeURIComponent(step)}&topic=${encodeURIComponent(t)}`,
        counts
      );
    }
  } else {
    if (!decodedShelf) {
      const counts = Object.fromEntries(
        STEP2_SHELVES.map((s) => [
          s,
          {
            total: STEP2_COUNTS[s] ?? 0,
            answered: answeredStep2Shelves[s] ?? 0,
          },
        ])
      );
      content = renderList(
        STEP2_SHELVES,
        (s) => `?step=${encodeURIComponent(step)}&shelf=${encodeURIComponent(s)}`,
        counts
      );
    } else {
      const systems = STEP2_SYSTEMS[decodedShelf] ?? [];
      const counts = Object.fromEntries(
        systems.map((sys) => [
          sys,
          {
            total: STEP2_SYSTEM_COUNTS[decodedShelf]?.[sys] ?? 0,
            answered: answeredStep2Systems[sys] ?? 0,
          },
        ])
      );
      content = renderList(
        systems,
        (sys) =>
          `/foundational/${encodeURIComponent(sys)}?step=${encodeURIComponent(step)}&shelf=${encodeURIComponent(decodedShelf)}`,
        counts
      );
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <PageTitle text="Foundational Questions" />
      <div className="flex gap-2 p-4">
        {NBME_STEPS.filter((s) => s !== "Mixed").map((s) => (
          <Link
            key={s}
            href={`?step=${encodeURIComponent(s)}`}
            className={`px-3 py-1 border rounded-md ${step === s ? "bg-tertiary" : ""}`}
          >
            {s}
          </Link>
        ))}
      </div>
      {content}
    </div>
  );
}
