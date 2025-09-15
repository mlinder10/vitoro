import {
  db,
  prompts,
  stepOneFoundationalFollowUps,
  stepOneFoundationalQuestions,
  stepOneNbmeQuestions,
  stepTwoFoundationalFollowUps,
  stepTwoFoundationalQuestions,
  stepTwoNbmeQuestions,
  users,
} from "@/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { count, sum } from "drizzle-orm";
import { formatNumber } from "@/lib/utils";

async function fetchData() {
  const tables = {
    userCount: users,
    stepOneNbmeCount: stepOneNbmeQuestions,
    stepTwoNbmeCount: stepTwoNbmeQuestions,
    stepOneFoundationalCount: stepOneFoundationalQuestions,
    stepOneFoundationalFollowCount: stepOneFoundationalFollowUps,
    stepTwoFoundationalCount: stepTwoFoundationalQuestions,
    stepTwoFoundationalFollowCount: stepTwoFoundationalFollowUps,
  };

  const entries = await Promise.all([
    // counts from each table
    ...Object.entries(tables).map(async ([key, table]) => {
      const [{ count: c }] = await db.select({ count: count() }).from(table);
      return [key, c] as const;
    }),
    // token sums
    (async () => {
      const [{ input, output }] = await db
        .select({
          input: sum(prompts.inputTokens),
          output: sum(prompts.outputTokens),
        })
        .from(prompts);
      return [
        "tokens",
        { input: Number(input ?? 0), output: Number(output ?? 0) },
      ] as const;
    })(),
  ]);

  return Object.fromEntries(entries) as Record<keyof typeof tables, number> & {
    tokens: { input: number; output: number };
  };
}

export default async function AdminPage() {
  const data = await fetchData();

  return (
    <main className="space-y-6 p-6">
      <h1 className="font-bold text-2xl">Admin Dashboard</h1>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
        <CountCard title="Users" count={data.userCount} />
        <CountCard
          title="Step One NBME Questions"
          count={data.stepOneNbmeCount}
        />
        <CountCard
          title="Step Two NBME Questions"
          count={data.stepTwoNbmeCount}
        />
        <CountCard
          title="Step One Foundational Questions"
          count={data.stepOneFoundationalCount}
        />
        <CountCard
          title="Step One Foundational Follow Ups"
          count={data.stepOneFoundationalFollowCount}
        />
        <CountCard
          title="Step Two Foundational Questions"
          count={data.stepTwoFoundationalCount}
        />
        <CountCard
          title="Step Two Foundational Follow Ups"
          count={data.stepTwoFoundationalFollowCount}
        />
        <CountCard title="Input Tokens" count={data.tokens.input} />
        <CountCard title="Output Tokens" count={data.tokens.output} />
      </div>
    </main>
  );
}

type CountCardProps = {
  title: string;
  count: number;
};

function CountCard({ title, count }: CountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-semibold text-3xl">{formatNumber(count)}</p>
      </CardContent>
    </Card>
  );
}
