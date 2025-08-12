import { answeredFoundationals, db, foundationalQuestions } from "@/db";
import PageTitle from "../_components/page-title";
import { getSession } from "@/lib/auth";
import { sql, eq, and } from "drizzle-orm";
import { SYSTEMS } from "@/types";
import { ArrowRight, Link } from "lucide-react";

type SystemData = {
  system: string;
  answered: number;
  unanswered: number;
};

// fetch question count from each system (answered and unanswered)
async function fetchSystems(userId: string): Promise<SystemData[]> {
  // 1) Total foundational questions per system
  const totals = await db
    .select({
      system: foundationalQuestions.system,
      total: sql<number>`COUNT(*)`.as("total"),
    })
    .from(foundationalQuestions)
    .groupBy(foundationalQuestions.system);

  // 2) Answered (completed) foundational questions per system for this user
  //    Use DISTINCT to avoid double-counting if a question was answered multiple times.
  const answered = await db
    .select({
      system: foundationalQuestions.system,
      answered:
        sql<number>`COUNT(DISTINCT ${answeredFoundationals.foundationalQuestionId})`.as(
          "answered"
        ),
    })
    .from(answeredFoundationals)
    .innerJoin(
      foundationalQuestions,
      eq(answeredFoundationals.foundationalQuestionId, foundationalQuestions.id)
    )
    .where(
      and(
        eq(answeredFoundationals.userId, userId),
        // isComplete is a json<boolean> column; comparing to true is fine
        eq(answeredFoundationals.isComplete, true)
      )
    )
    .groupBy(foundationalQuestions.system);

  const answeredMap = new Map<string, number>(
    answered.map((r) => [r.system, Number(r.answered ?? 0)])
  );

  return totals.map((t) => {
    const a = answeredMap.get(t.system) ?? 0;
    const total = Number(t.total ?? 0);
    return {
      system: t.system,
      answered: a,
      unanswered: Math.max(0, total - a),
    };
  });
}

export default async function FoundationalQuestionsPage() {
  const { id } = await getSession();
  const systems = await fetchSystems(id);

  return (
    <div className="h-full overflow-y-auto">
      <PageTitle text="Foundational Questions" />
      <div className="space-y-4 p-4">
        {SYSTEMS.map((s) => {
          const data = systems.find((sys) => sys.system === s.name);
          return (
            <Link
              key={s.name}
              className="flex justify-between items-center px-6 py-4 hover:pr-2 border rounded-md transition-all cursor-pointer"
              href={`/foundational/${s.name}`}
            >
              <div className="space-y-2">
                <p>{s.name}</p>
                <div className="flex gap-4 text-muted-foreground text-sm">
                  <span>Answered • {data?.answered ?? 0}</span>
                  <span>Unanswered • {data?.unanswered ?? 0}</span>
                </div>
              </div>
              <ArrowRight size={16} className="text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
