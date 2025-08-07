import { db, questions, users } from "@/db";
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
import { count, gte, eq } from "drizzle-orm";

async function fetchQuestionData() {
  const [{ count: total }] = await db
    .select({ count: count() })
    .from(questions);

  const startDate = subDays(new Date(), 30);

  const raw = await db
    .select({
      createdAt: questions.createdAt,
      count: count(),
    })
    .from(questions)
    .where(gte(questions.createdAt, startDate))
    .groupBy(questions.createdAt);

  const dailyCounts: Record<string, number> = {};
  raw.forEach(({ createdAt, count }) => {
    const day = format(createdAt, "yyyy-MM-dd");
    dailyCounts[day] = (dailyCounts[day] || 0) + count;
  });

  return {
    totalQuestions: total,
    dailyCounts,
  };
}

async function fetchSystemData() {
  const rows = await db
    .select({
      system: questions.system,
      category: questions.category,
      subcategory: questions.subcategory,
      count: count(),
    })
    .from(questions)
    .groupBy(questions.system, questions.category, questions.subcategory);

  return rows.map((row) => ({
    system: row.system,
    category: row.category,
    subcategory: row.subcategory,
    count: row.count,
  }));
}

async function fetchAdminData() {
  const topCreators = await db
    .select({
      questionCount: count(),
      creatorId: questions.creatorId,
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(questions)
    .innerJoin(users, eq(questions.creatorId, users.id))
    .groupBy(users.id)
    .orderBy(count())
    .limit(5);

  return topCreators.map((row) => ({
    user: {
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
    },
    questionCount: row.questionCount,
  }));
}

export default async function AdminPage() {
  const [questionData, systemData, adminData] = await Promise.all([
    fetchQuestionData(),
    fetchSystemData(),
    fetchAdminData(),
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

        <Card>
          <CardHeader>
            <CardTitle>Top Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {adminData.map((admin) => (
                <li key={admin.user.id} className="flex justify-between">
                  <span>
                    {admin.user.firstName} {admin.user.lastName}
                  </span>
                  <span>{admin.questionCount}</span>
                </li>
              ))}
            </ul>
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
