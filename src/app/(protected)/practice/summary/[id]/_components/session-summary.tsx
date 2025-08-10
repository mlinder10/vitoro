import { QBankSession, Question, QuestionDifficulty } from "@/types";
import React from "react";

/**
 * Enhanced Session Summary for an NBME-style practice exam
 *
 * Drop-in replacement for your current component. Keeps your ProgressCircle
 * but adds: key stats, system & difficulty breakdowns, weak topics, and CTAs.
 *
 * Assumptions:
 * - You have a <ProgressCircle percentage size startColor> component
 * - You have scoreToHex(percentage: number): string
 * - splitQuestions(session, questions) -> { correct, incorrect, unanswered }
 * - question.system is a string or enum that can be stringified
 * - question.difficulty is one of: "Easy" | "Medium" | "Hard"
 */

// ------- Types (align these with your actual app types) -------
export type QuestionChoice = string | number; // adjust as needed

export type SplitResult = {
  correct: Question[];
  incorrect: Question[];
  unanswered: Question[];
};

export type SessionSummaryProps = {
  session: QBankSession;
  questions: Question[];
  splitQuestions: (s: QBankSession, qs: Question[]) => SplitResult;
  ProgressCircle: React.ComponentType<{
    percentage: number; // 0..1
    size?: number;
    startColor?: string;
    children?: React.ReactNode;
  }>;
  scoreToHex: (p: number) => string;
  onReviewAll?: () => void;
  onRetakeIncorrect?: () => void;
  onReviewTopic?: (system: string) => void; // called from weak areas list
};

// ------- Utilities -------
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const formatPercent = (ratio: number) => `${Math.round(clamp01(ratio) * 100)}%`;

// const formatDuration = (sec?: number) => {
//   if (!sec || sec <= 0) return "—";
//   const h = Math.floor(sec / 3600);
//   const m = Math.floor((sec % 3600) / 60);
//   const s = Math.floor(sec % 60);
//   if (h > 0) return `${h}h ${m}m`;
//   if (m > 0) return `${m}m ${s}s`;
//   return `${s}s`;
// };

// rank helper for weak areas: lower correct% first
const byAscendingPct = (
  a: { system: string; pct: number },
  b: { system: string; pct: number }
) => a.pct - b.pct;

// Tailwind bar component for simple viz
const Bar = ({ pct }: { pct: number }) => (
  <div className="bg-muted rounded-full w-full h-2">
    <div
      className="bg-primary rounded-full h-2"
      style={{ width: `${clamp01(pct) * 100}%` }}
    />
  </div>
);

const StatChip = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col justify-center items-center shadow-sm p-3 border rounded-2xl text-center">
    <div className="text-muted-foreground text-xs">{label}</div>
    <div className="font-semibold text-lg">{value}</div>
  </div>
);

// ------- Main Component -------
export default function SessionSummary({
  session,
  questions,
  splitQuestions,
  ProgressCircle,
  scoreToHex,
  onReviewAll,
  onRetakeIncorrect,
  onReviewTopic,
}: SessionSummaryProps) {
  // Build answer map for per-question evaluation
  const answerById = React.useMemo(() => {
    const map = new Map<string, QuestionChoice | null>();
    session.questionIds.forEach((qid, i) =>
      map.set(qid, session.answers[i] ?? null)
    );
    return map;
  }, [session.questionIds, session.answers]);

  const { correct, incorrect, unanswered } = splitQuestions(session, questions);

  const total = questions.length;
  const numCorrect = correct.length;
  const numIncorrect = incorrect.length;
  const numUnanswered = unanswered.length;

  const pct = total > 0 ? numCorrect / total : 0;
  const pctLabel = formatPercent(pct);

  // Aggregate by system and difficulty
  const systemAgg = new Map<string, { total: number; correct: number }>();
  const difficultyAgg = new Map<
    QuestionDifficulty,
    { total: number; correct: number }
  >([
    ["Easy", { total: 0, correct: 0 }],
    ["Moderate", { total: 0, correct: 0 }],
    ["Hard", { total: 0, correct: 0 }],
  ]);

  for (const q of questions) {
    const given = answerById.get(q.id);
    const isCorrect = given != null && given === q.answer;

    // system
    const sys = String(q.system);
    const s = systemAgg.get(sys) ?? { total: 0, correct: 0 };
    s.total += 1;
    if (isCorrect) s.correct += 1;
    systemAgg.set(sys, s);

    // difficulty
    const d = difficultyAgg.get(q.difficulty) ?? { total: 0, correct: 0 };
    d.total += 1;
    if (isCorrect) d.correct += 1;
    difficultyAgg.set(q.difficulty, d);
  }

  const systemRows = Array.from(systemAgg.entries())
    .map(([system, { total, correct }]) => ({
      system,
      total,
      correct,
      pct: total > 0 ? correct / total : 0,
    }))
    .sort((a, b) => b.pct - a.pct); // best first in the table

  const weakest = [...systemRows]
    .sort(byAscendingPct)
    .slice(0, Math.min(3, systemRows.length));

  const easy = difficultyAgg.get("Easy")!;
  const med = difficultyAgg.get("Moderate")!;
  const hard = difficultyAgg.get("Hard")!;

  const easyPct = easy.total ? easy.correct / easy.total : 0;
  const medPct = med.total ? med.correct / med.total : 0;
  const hardPct = hard.total ? hard.correct / hard.total : 0;

  const dateStr = new Date(session.createdAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-8 mx-auto p-4 sm:p-6 w-full max-w-5xl">
      {/* Hero */}
      <section className="items-center gap-6 grid grid-cols-1 md:grid-cols-3">
        <div className="flex flex-col justify-center items-center md:col-span-1">
          <ProgressCircle
            percentage={pct}
            size={220}
            startColor={scoreToHex(pct)}
          >
            <span className="font-bold tabular-nums text-4xl">{pctLabel}</span>
          </ProgressCircle>
          <p className="mt-3 text-muted-foreground text-sm">
            You answered <span className="font-semibold">{numCorrect}</span> of{" "}
            {total} correctly
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* {session.examName && (
              <span className="bg-primary/10 px-3 py-1 rounded-full font-medium text-primary text-xs">
                {session.examName}
              </span>
            )}
            {session.step && (
              <span className="bg-secondary/60 px-3 py-1 rounded-full font-medium text-xs">
                {session.step}
              </span>
            )} */}
            <span className="bg-muted px-3 py-1 rounded-full font-medium text-muted-foreground text-xs">
              {dateStr}
            </span>
          </div>

          <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
            <StatChip
              label="Correct"
              value={<span className="tabular-nums">{numCorrect}</span>}
            />
            <StatChip
              label="Incorrect"
              value={<span className="tabular-nums">{numIncorrect}</span>}
            />
            <StatChip
              label="Unanswered"
              value={<span className="tabular-nums">{numUnanswered}</span>}
            />
            {/* <StatChip label="Time" value={formatDuration(session.durationSec)} /> */}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              onClick={onReviewAll}
              className="hover:bg-accent shadow-sm px-4 py-2 border rounded-2xl font-medium text-sm"
            >
              Review All Questions
            </button>
            <button
              type="button"
              onClick={onRetakeIncorrect}
              className="bg-primary hover:opacity-90 shadow-sm px-4 py-2 rounded-2xl font-medium text-primary-foreground text-sm"
              disabled={numIncorrect + numUnanswered === 0}
              title={
                numIncorrect + numUnanswered === 0
                  ? "Nothing to retake"
                  : undefined
              }
            >
              Retake Incorrect Only
            </button>
          </div>
        </div>
      </section>

      {/* Performance by System */}
      <section>
        <h3 className="mb-3 font-semibold text-lg">Performance by System</h3>
        {systemRows.length === 0 ? (
          <p className="text-muted-foreground text-sm">No system data.</p>
        ) : (
          <div className="border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 bg-muted/50 p-3 font-medium text-muted-foreground text-xs">
              <div className="col-span-5">System</div>
              <div className="col-span-5">Accuracy</div>
              <div className="col-span-1 text-right">%</div>
              <div className="col-span-1 text-right">N</div>
            </div>
            <ul className="divide-y">
              {systemRows.map((row) => (
                <li
                  key={row.system}
                  className="items-center gap-3 grid grid-cols-12 p-3"
                >
                  <div className="flex items-center gap-2 col-span-5">
                    <span className="font-medium truncate">{row.system}</span>
                    {onReviewTopic && (
                      <button
                        type="button"
                        onClick={() => onReviewTopic(row.system)}
                        className="hover:bg-accent px-2 py-1 border rounded-full text-[10px]"
                      >
                        Review
                      </button>
                    )}
                  </div>
                  <div className="col-span-5">
                    <Bar pct={row.pct} />
                  </div>
                  <div className="col-span-1 tabular-nums text-right">
                    {formatPercent(row.pct)}
                  </div>
                  <div className="col-span-1 tabular-nums text-right">
                    {row.total}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Difficulty Breakdown */}
      <section className="gap-4 grid grid-cols-1 md:grid-cols-3">
        <div className="shadow-sm p-4 border rounded-2xl">
          <div className="mb-2 font-semibold text-sm">Easy</div>
          <Bar pct={easyPct} />
          <div className="mt-1 text-muted-foreground text-xs text-right">
            {easy.total} Q • {formatPercent(easyPct)} correct
          </div>
        </div>
        <div className="shadow-sm p-4 border rounded-2xl">
          <div className="mb-2 font-semibold text-sm">Medium</div>
          <Bar pct={medPct} />
          <div className="mt-1 text-muted-foreground text-xs text-right">
            {med.total} Q • {formatPercent(medPct)} correct
          </div>
        </div>
        <div className="shadow-sm p-4 border rounded-2xl">
          <div className="mb-2 font-semibold text-sm">Hard</div>
          <Bar pct={hardPct} />
          <div className="mt-1 text-muted-foreground text-xs text-right">
            {hard.total} Q • {formatPercent(hardPct)} correct
          </div>
        </div>
      </section>

      {/* Weak Areas */}
      <section>
        <h3 className="mb-3 font-semibold text-lg">Top Weak Areas</h3>
        {weakest.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            You have no weak areas for this session.
          </p>
        ) : (
          <ol className="space-y-2">
            {weakest.map((w, i) => (
              <li
                key={w.system}
                className="flex justify-between items-center shadow-sm p-3 border rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-muted rounded-full w-7 h-7 font-semibold text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-medium">{w.system}</div>
                    <div className="text-muted-foreground text-xs">
                      {w.correct}/{w.total} • {formatPercent(w.pct)} correct
                    </div>
                  </div>
                </div>
                {onReviewTopic && (
                  <button
                    type="button"
                    onClick={() => onReviewTopic(w.system)}
                    className="bg-secondary hover:opacity-90 px-3 py-1.5 rounded-2xl font-medium text-xs"
                  >
                    Drill this system
                  </button>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Flags and Notes */}
      <section className="gap-4 grid grid-cols-1 sm:grid-cols-2">
        <div className="shadow-sm p-4 border rounded-2xl">
          <div className="mb-1 font-semibold text-sm">Flagged</div>
          <p className="text-muted-foreground text-sm">
            You flagged{" "}
            <span className="font-semibold">
              {session.flaggedQuestionIds.length}
            </span>{" "}
            question{session.flaggedQuestionIds.length === 1 ? "" : "s"} to
            revisit.
          </p>
        </div>
        <div className="shadow-sm p-4 border rounded-2xl">
          <div className="mb-1 font-semibold text-sm">Pacing</div>
          {/* <p className="text-muted-foreground text-sm">
            Total time: <span className="font-semibold">{formatDuration(session.durationSec)}</span>
            {" "}• Avg/question: {total > 0 && session.durationSec ? (
              <span className="font-semibold">{formatDuration(Math.round(session.durationSec / total))}</span>
            ) : (
              "—"
            )}
          </p> */}
        </div>
      </section>
    </div>
  );
}
