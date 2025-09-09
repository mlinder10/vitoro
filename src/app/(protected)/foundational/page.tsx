import GradientTitle from "@/components/gradient-title";
import {
  answeredStepOneFoundationals,
  answeredStepTwoFoundationals,
  db,
  stepOneFoundationalQuestions,
  stepTwoFoundationalQuestions,
} from "@/db";
import { and, count, eq } from "drizzle-orm";
import { ChevronRight } from "lucide-react";

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
  const { stepOne, stepTwo } = await fetchQuestionCategories("1");

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
            />
          ))}
        </section>
      </div>
    </div>
  );
}

type CategoryRowProps = {
  category: string;
  answered: number;
  total: number;
};

function CategoryRow({ category, answered, total }: CategoryRowProps) {
  return (
    <div className="flex justify-between items-center bg-tertiary p-4 border rounded-md">
      <div>
        <p className="font-semibold text-lg">{category}</p>
        <p className="text-muted-foreground">
          Answered {answered} / {total}
        </p>
      </div>
      <ChevronRight className="text-muted-foreground" size={16} />
    </div>
  );
}
