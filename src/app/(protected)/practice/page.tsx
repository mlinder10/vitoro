import { getSession } from "@/lib/auth";
import { LOGIN_PATH } from "@/lib/constants";
import { redirect } from "next/navigation";
import { fetchUnansweredQuestion } from "./actions";

export default async function ReviewPage() {
  const session = await getSession();
  if (!session) redirect(LOGIN_PATH);
  const question = await fetchUnansweredQuestion(session.id);

  if (!question)
    return (
      <main>
        <div>
          <p>You have answered all of our questions!</p>
        </div>
      </main>
    );

  return redirect(`/practice/${question.id}`);
}
