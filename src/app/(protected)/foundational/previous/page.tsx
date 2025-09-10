import GradientTitle from "@/components/gradient-title";
import { db, answeredStepOneFoundationals, answeredStepTwoFoundationals, stepOneFoundationalQuestions, stepTwoFoundationalQuestions } from "@/db";
import { getSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import Link from "next/link";

export default async function PreviousFoundationalPage() {
  const { id } = await getSession();

  const stepOne = await db
    .select({
      questionId: answeredStepOneFoundationals.foundationalQuestionId,
      subject: stepOneFoundationalQuestions.subject,
      answers: answeredStepOneFoundationals.answers,
    })
    .from(answeredStepOneFoundationals)
    .innerJoin(
      stepOneFoundationalQuestions,
      eq(
        answeredStepOneFoundationals.foundationalQuestionId,
        stepOneFoundationalQuestions.id
      )
    )
    .where(
      and(
        eq(answeredStepOneFoundationals.userId, id),
        eq(answeredStepOneFoundationals.isComplete, false)
      )
    );

  const stepTwo = await db
    .select({
      questionId: answeredStepTwoFoundationals.foundationalQuestionId,
      shelf: stepTwoFoundationalQuestions.shelf,
      answers: answeredStepTwoFoundationals.answers,
    })
    .from(answeredStepTwoFoundationals)
    .innerJoin(
      stepTwoFoundationalQuestions,
      eq(
        answeredStepTwoFoundationals.foundationalQuestionId,
        stepTwoFoundationalQuestions.id
      )
    )
    .where(
      and(
        eq(answeredStepTwoFoundationals.userId, id),
        eq(answeredStepTwoFoundationals.isComplete, false)
      )
    );

  return (
    <div className="flex flex-col h-full p-8 gap-8">
      <GradientTitle text="Previous Sessions" className="font-bold text-4xl" />
      <section className="flex flex-col gap-4">
        <p className="font-semibold text-2xl">Step One</p>
        {stepOne.map((q) => {
          const answered = 1 + q.answers.filter((a) => a !== null).length;
          const total = 1 + q.answers.length;
          return (
            <Link
              key={q.questionId}
              href={`/foundational/step-one/${q.questionId}`}
              className="flex justify-between items-center bg-tertiary p-4 border rounded-md"
            >
              <div>
                <p className="font-semibold">{q.subject}</p>
                <p className="text-muted-foreground">Progress {answered} / {total}</p>
              </div>
            </Link>
          );
        })}
        {stepOne.length === 0 && (
          <p className="text-muted-foreground">No ongoing Step One sessions</p>
        )}
      </section>
      <section className="flex flex-col gap-4">
        <p className="font-semibold text-2xl">Step Two</p>
        {stepTwo.map((q) => {
          const answered = 1 + q.answers.filter((a) => a !== null).length;
          const total = 1 + q.answers.length;
          return (
            <Link
              key={q.questionId}
              href={`/foundational/step-two/${q.questionId}`}
              className="flex justify-between items-center bg-tertiary p-4 border rounded-md"
            >
              <div>
                <p className="font-semibold">{q.shelf}</p>
                <p className="text-muted-foreground">Progress {answered} / {total}</p>
              </div>
            </Link>
          );
        })}
        {stepTwo.length === 0 && (
          <p className="text-muted-foreground">No ongoing Step Two sessions</p>
        )}
      </section>
    </div>
  );
}
