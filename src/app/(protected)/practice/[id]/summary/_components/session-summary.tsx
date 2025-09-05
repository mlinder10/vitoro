import ProgressCircle from "@/components/progress-circle";
import {
  QBankSession,
  NBMEQuestion,
  QuestionChoice,
  QuestionDifficulty,
} from "@/types";
import { useMemo } from "react";

export type SplitResult = {
  correct: NBMEQuestion[];
  incorrect: NBMEQuestion[];
  unanswered: NBMEQuestion[];
};

export type SessionSummaryProps = {
  session: QBankSession;
  questions: NBMEQuestion[];
  onReviewAll?: () => void;
  onRetakeIncorrect?: () => void;
  onReviewTopic?: (system: string) => void;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const formatPercent = (ratio: number) => `${Math.round(clamp01(ratio) * 100)}%`;

function scoreToHex(percentage: number) {
  const hue = Math.round(clamp01(percentage) * 120);
  return `hsl(${hue}, 100%, 50%)`;
}

function splitQuestions(s: QBankSession, qs: NBMEQuestion[]): SplitResult {
  const unanswered = s.answers
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => q === null)
    .map(({ i }) => qs[i]);
  const orderedQuestions = s.questionIds.map(
    (id) => qs.find((q) => q.id === id)!
  );
  const correct: NBMEQuestion[] = [];
  const incorrect: NBMEQuestion[] = [];
  for (let i = 0; i < orderedQuestions.length; i++) {
    if (orderedQuestions[i].answer === s.answers[i]) {
      correct.push(orderedQuestions[i]);
    } else {
      if (s.answers[i] !== null) {
        incorrect.push(orderedQuestions[i]);
      }
    }
  }
  return { correct, incorrect, unanswered };
}

function byAscendingPct(
  a: { system: string; pct: number },
  b: { system: string; pct: number }
) {
  return a.pct - b.pct;
}

function Bar({ pct }: { pct: number }) {
  return (
    <div className="bg-muted rounded-full w-full h-2">
      <div
        className="bg-primary rounded-full h-2"
        style={{ width: `${clamp01(pct) * 100}%` }}
      />
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center items-center shadow-sm p-3 border rounded-2xl text-center">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="font-semibold text-lg">{value}</div>
    </div>
  );
}

export default function SessionSummary({
  session,
  questions,
  onReviewAll,
  onRetakeIncorrect,
  onReviewTopic,
}: SessionSummaryProps) {
  const answerById = useMemo(() => {
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
    switch (q.step) {
      case "Step 1":
        for (const s of q.systems) {
          const sAgg = systemAgg.get(s) ?? { total: 0, correct: 0 };
          sAgg.total += 1;
          if (isCorrect) sAgg.correct += 1;
          systemAgg.set(s, sAgg);
        }
        break;
      case "Step 2":
        const s = systemAgg.get(q.system) ?? { total: 0, correct: 0 };
        s.total += 1;
        if (isCorrect) s.correct += 1;
        systemAgg.set(q.system, s);
        break;
    }
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
    .sort((a, b) => b.pct - a.pct);

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
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {onReviewAll && (
              <button
                type="button"
                onClick={onReviewAll}
                className="hover:bg-accent shadow-sm px-4 py-2 border rounded-2xl font-medium text-sm"
              >
                Review All Questions
              </button>
            )}
            {onRetakeIncorrect && (
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
            )}
          </div>
        </div>
      </section>

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
      </section>
    </div>
  );
}
