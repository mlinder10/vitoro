import { Target, Layers } from "lucide-react";
import Link from "next/link";
import { ComponentType } from "react";
import GradientTitle from "@/components/gradient-title";
import ProgressCircle from "@/components/progress-circle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  answeredStepOneNbmes,
  answeredStepTwoNbmes,
  db,
  stepOneNbmeQuestions,
  stepTwoNbmeQuestions,
} from "@/db";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { formatPercent, scoreToHex } from "@/lib/utils";

type WeakArea = {
  system: string;
  total: number;
  correct: number;
  pct: number;
};

async function getStats(userId: string) {
  const [stepOne, stepTwo] = await Promise.all([
    db
      .select({
        systems: stepOneNbmeQuestions.systems,
        answer: answeredStepOneNbmes.answer,
        correct: stepOneNbmeQuestions.answer,
      })
      .from(answeredStepOneNbmes)
      .innerJoin(
        stepOneNbmeQuestions,
        eq(answeredStepOneNbmes.questionId, stepOneNbmeQuestions.id)
      )
      .where(eq(answeredStepOneNbmes.userId, userId)),
    db
      .select({
        system: stepTwoNbmeQuestions.system,
        answer: answeredStepTwoNbmes.answer,
        correct: stepTwoNbmeQuestions.answer,
      })
      .from(answeredStepTwoNbmes)
      .innerJoin(
        stepTwoNbmeQuestions,
        eq(answeredStepTwoNbmes.questionId, stepTwoNbmeQuestions.id)
      )
      .where(eq(answeredStepTwoNbmes.userId, userId)),
  ]);

  let total = 0;
  let correct = 0;
  const systemAgg = new Map<string, { total: number; correct: number }>();

  for (const row of stepOne) {
    total += 1;
    const isCorrect = row.answer === row.correct;
    if (isCorrect) correct += 1;
    for (const s of row.systems) {
      const agg = systemAgg.get(s) ?? { total: 0, correct: 0 };
      agg.total += 1;
      if (isCorrect) agg.correct += 1;
      systemAgg.set(s, agg);
    }
  }

  for (const row of stepTwo) {
    total += 1;
    const isCorrect = row.answer === row.correct;
    if (isCorrect) correct += 1;
    const agg = systemAgg.get(row.system) ?? { total: 0, correct: 0 };
    agg.total += 1;
    if (isCorrect) agg.correct += 1;
    systemAgg.set(row.system, agg);
  }

  const pct = total > 0 ? correct / total : 0;
  const systemRows: WeakArea[] = Array.from(systemAgg.entries()).map(
    ([system, { total, correct }]) => ({
      system,
      total,
      correct,
      pct: total > 0 ? correct / total : 0,
    })
  );
  const weakest = systemRows
    .sort((a, b) => a.pct - b.pct)
    .slice(0, Math.min(3, systemRows.length));

  return { pct, correct, total, weakest };
}

export default async function HomePage() {
  const { id } = await getSession();
  const stats = await getStats(id);

  return (
    <div className="flex flex-col gap-8 p-8 pb-20 min-h-full">
      <GradientTitle text="Vitoro" className="font-bold text-6xl" />

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-muted-foreground">Study Materials</h2>
        <div className="gap-4 grid md:grid-cols-2">
          <RowItem
            icon={Target}
            title="Question Bank"
            description="Prepare for your exams with our carefully curated question bank of NBME-style questions."
            link="/practice"
          />
          <RowItem
            icon={Layers}
            title="Foundational"
            description="Master core concepts with our foundational question sets."
            link="/foundational"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-muted-foreground">Your Progress</h2>
        <div className="gap-4 grid md:grid-cols-2">
          <Card className="text-center">
            <CardHeader className="items-center text-center">
              <CardTitle className="text-xl">Overall Accuracy</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <ProgressCircle
                percentage={stats.pct}
                size={200}
                startColor={scoreToHex(stats.pct)}
              >
                <span className="font-bold text-xl">
                  {`${formatPercent(stats.pct)} correct`}
                </span>
              </ProgressCircle>
              <p className="max-w-[10rem] text-muted-foreground text-sm">
                {stats.correct} out of {stats.total} correct
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="items-center text-center">
              <CardTitle className="text-xl">Top Weak Areas</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.weakest.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  You have no weak areas.
                </p>
              ) : (
                <div className="flex flex-col gap-2 text-sm">
                  {stats.weakest.map((w) => (
                    <div
                      key={w.system}
                      className="flex justify-between p-2 border rounded"
                    >
                      <span>{w.system}</span>
                      <span className="text-muted-foreground">
                        {w.correct}/{w.total} • {formatPercent(w.pct)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

type RowItemProps = {
  title: string;
  description: string;
  link: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

function RowItem({ title, description, link, icon: Icon }: RowItemProps) {
  return (
    <Link href={link} className="block">
      <Card className="hover:ring-2 hover:ring-custom-accent h-full text-center transition-all">
        <CardContent className="flex flex-col items-center gap-2 p-6">
          <Icon size={32} />
          <p className="font-bold text-lg">{title}</p>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
