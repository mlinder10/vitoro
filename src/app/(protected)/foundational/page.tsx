import GradientTitle from "@/components/gradient-title";
import {
  answeredStepOneFoundationals,
  answeredStepTwoFoundationals,
  db,
  stepOneFoundationalQuestions,
  stepTwoFoundationalQuestions,
} from "@/db";
import { and, count, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import CategoryRow from "./_components/category-row";

async function fetchQuestionCategories(userId: string) {
  const [stepOne, stepTwo, stepOneAnswered, stepTwoAnswered] =
    await Promise.all([
      db
        .select({
          subject: stepOneFoundationalQuestions.subject,
          count: count(),
        })
        .from(stepOneFoundationalQuestions)
        .groupBy(stepOneFoundationalQuestions.subject),

      db
        .select({
          shelf: stepTwoFoundationalQuestions.shelf,
          count: count(),
        })
        .from(stepTwoFoundationalQuestions)
        .groupBy(stepTwoFoundationalQuestions.shelf),

      db
        .select({
          subject: stepOneFoundationalQuestions.subject,
          count: count(answeredStepOneFoundationals.id),
        })
        .from(stepOneFoundationalQuestions)
        .leftJoin(
          answeredStepOneFoundationals,
          and(
            eq(
              answeredStepOneFoundationals.foundationalQuestionId,
              stepOneFoundationalQuestions.id
            ),
            eq(answeredStepOneFoundationals.userId, userId)
          )
        )
        .groupBy(stepOneFoundationalQuestions.subject),

      db
        .select({
          shelf: stepTwoFoundationalQuestions.shelf,
          count: count(answeredStepTwoFoundationals.id),
        })
        .from(stepTwoFoundationalQuestions)
        .leftJoin(
          answeredStepTwoFoundationals,
          and(
            eq(
              answeredStepTwoFoundationals.foundationalQuestionId,
              stepTwoFoundationalQuestions.id
            ),
            eq(answeredStepTwoFoundationals.userId, userId)
          )
        )
        .groupBy(stepTwoFoundationalQuestions.shelf),
    ]);

  return {
    stepOne: stepOne.map((q) => ({
      subject: q.subject,
      count: q.count,
      answered:
        stepOneAnswered.find((a) => a.subject === q.subject)?.count ?? 0,
    })),
    stepTwo: stepTwo.map((q) => ({
      shelf: q.shelf,
      count: q.count,
      answered: stepTwoAnswered.find((a) => a.shelf === q.shelf)?.count ?? 0,
    })),
  };
}

export default async function FoundationalQuestionsPage() {
  const { id } = await getSession();
  const { stepOne, stepTwo } = await fetchQuestionCategories(id);

  return (
    <div className="flex flex-col h-full">
      <GradientTitle
        text="Foundational Questions"
        className="mx-auto py-8 font-bold text-4xl"
      />
      <div className="flex-1 grid grid-cols-2 overflow-y-hidden">
        <section className="flex flex-col gap-4 p-8 pr-4 h-full overflow-y-auto">
          <p className="font-semibold text-2xl">Step One</p>
          {stepOne.map((q) => (
            <CategoryRow
              key={q.subject}
              category={q.subject}
              answered={q.answered}
              total={q.count}
              step="Step 1"
              userId={id}
            />
          ))}
        </section>

        <section className="flex flex-col gap-4 p-8 pl-4 h-full overflow-y-auto">
          <p className="font-semibold text-2xl">Step Two</p>
          {stepTwo.map((q) => (
            <CategoryRow
              key={q.shelf}
              category={q.shelf}
              answered={q.answered}
              total={q.count}
              step="Step 2"
              userId={id}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
