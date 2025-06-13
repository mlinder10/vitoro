import db from "@/db/db";
import { Question } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function ReviewPage() {
  // fetch random question and redirect to it
  const question =
    (await db.$queryRaw`SELECT * FROM Question ORDER BY RANDOM() LIMIT 1`) as Question[];
  return redirect(`/practice/${question[0].id}`);
}
