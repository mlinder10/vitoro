import { db, stepOneNbmeQuestions, stepTwoNbmeQuestions } from "@/db";
import { subDays, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import QuestionChart from "./_components/question-chart";
import { count, gte } from "drizzle-orm";

async function fetchQuestionData() {
  const startDate = subDays(new Date(), 30);
  const [
    [{ count: stepOneCount }],
    [{ count: stepTwoCount }],
    stepOnePerDay,
    stepTwoPerDay,
  ] = await Promise.all([
    db.select({ count: count() }).from(stepOneNbmeQuestions),
    db.select({ count: count() }).from(stepTwoNbmeQuestions),
    db
      .select({
        createdAt: stepOneNbmeQuestions.createdAt,
        count: count(),
      })
      .from(stepOneNbmeQuestions)
      .where(gte(stepOneNbmeQuestions.createdAt, startDate))
      .groupBy(stepOneNbmeQuestions.createdAt),
    db
      .select({
        createdAt: stepTwoNbmeQuestions.createdAt,
        count: count(),
      })
      .from(stepTwoNbmeQuestions)
      .where(gte(stepTwoNbmeQuestions.createdAt, startDate))
      .groupBy(stepTwoNbmeQuestions.createdAt),
  ]);

  const dailyCounts: Record<string, number> = {};

  stepOnePerDay.forEach(({ createdAt, count }) => {
    const day = format(createdAt, "yyyy-MM-dd");
    dailyCounts[day] = (dailyCounts[day] || 0) + count;
  });

  stepTwoPerDay.forEach(({ createdAt, count }) => {
    const day = format(createdAt, "yyyy-MM-dd");
    dailyCounts[day] = (dailyCounts[day] || 0) + count;
  });

  return {
    totalQuestions: stepOneCount + stepTwoCount,
    dailyCounts,
  };
}

async function fetchSystemData() {
  const rows = await db
    .select({
      system: stepTwoNbmeQuestions.system,
      category: stepTwoNbmeQuestions.category,
      subcategory: stepTwoNbmeQuestions.subcategory,
      count: count(),
    })
    .from(stepTwoNbmeQuestions)
    .groupBy(
      stepTwoNbmeQuestions.system,
      stepTwoNbmeQuestions.category,
      stepTwoNbmeQuestions.subcategory
    );

  return rows.map((row) => ({
    system: row.system,
    category: row.category,
    subcategory: row.subcategory,
    count: row.count,
  }));
}

export default async function AdminPage() {
  const [questionData, systemData] = await Promise.all([
    fetchQuestionData(),
    fetchSystemData(),
  ]);

  const dailyData = Object.entries(questionData.dailyCounts).map(
    ([date, count]) => ({
      date,
      count,
    })
  );

  return (
    <main className="space-y-6 p-6">
      <h1 className="font-bold text-2xl">Admin Dashboard</h1>

      {/* Summary Card */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-3xl">
              {questionData.totalQuestions}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Questions Created (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <QuestionChart dailyData={dailyData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>System Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-96 overflow-y-auto">
          <Table className="min-w-full text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">System</TableHead>
                <TableHead className="text-left">Category</TableHead>
                <TableHead className="text-left">Subcategory</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systemData.map((row, i) => (
                <TableRow key={i} className="border-t">
                  <TableCell>{row.system}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.subcategory}</TableCell>
                  <TableCell className="text-right">{row.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
