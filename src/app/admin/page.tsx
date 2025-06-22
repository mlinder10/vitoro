import db from "@/db/db";
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

async function fetchQuestionData() {
  const totalQuestions = await db.question.count();

  const startDate = subDays(new Date(), 30);
  const dailyCountsRaw = await db.question.groupBy({
    by: ["createdAt"],
    _count: { _all: true },
    where: {
      createdAt: {
        gte: startDate,
      },
    },
  });

  // Group by day (YYYY-MM-DD)
  const dailyCounts: Record<string, number> = {};
  dailyCountsRaw.forEach(({ createdAt, _count }) => {
    const day = format(createdAt, "yyyy-MM-dd");
    dailyCounts[day] = (dailyCounts[day] || 0) + _count._all;
  });

  return { totalQuestions, dailyCounts };
}

async function fetchSystemData() {
  const grouped = await db.question.groupBy({
    by: ["system", "category", "subcategory"],
    _count: { _all: true },
  });

  return grouped.map((g) => ({
    system: g.system,
    category: g.category,
    subcategory: g.subcategory,
    count: g._count._all,
  }));
}

async function fetchAdminData() {
  const topAdmins = await db.question.groupBy({
    by: ["creatorId"],
    _count: {
      creatorId: true,
    },
    orderBy: {
      _count: {
        creatorId: "desc",
      },
    },
    take: 5,
  });

  const adminIds = topAdmins.map((a) => a.creatorId);

  const users = await db.user.findMany({
    where: { id: { in: adminIds } },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  return topAdmins.map((entry) => ({
    user: userMap[entry.creatorId],
    questionCount: entry._count.creatorId,
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
