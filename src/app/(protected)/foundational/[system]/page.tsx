import {
  answeredFoundationals,
  db,
  foundationalFollowUps,
  foundationalQuestions,
} from "@/db";
import { getSession } from "@/lib/auth";
import { eq, and, isNull, or } from "drizzle-orm";
import { notFound } from "next/navigation";
import {
  FoundationalQuestionBase,
  FoundationalQuestionFollowup,
} from "./_components/foundational-question-view";
import {
  AnsweredFoundational,
  NBMEStep,
  FoundationalFollowup,
} from "@/types";

async function fetchFoundationalQuestion(
  userId: string,
  system: string,
  step: NBMEStep
) {
  const [question] = await db
    .select()
    .from(foundationalQuestions)
    .where(
      and(
        eq(foundationalQuestions.system, system),
        eq(foundationalQuestions.step, step),
        or(
          isNull(answeredFoundationals.id),
          eq(answeredFoundationals.isComplete, false)
        )
      )
    )
    .leftJoin(
      answeredFoundationals,
      and(
        eq(
          answeredFoundationals.foundationalQuestionId,
          foundationalQuestions.id
        ),
        eq(answeredFoundationals.userId, userId)
      )
    )
    .limit(1);

  if (!question) return null;

  const followups = await db
    .select()
    .from(foundationalFollowUps)
    .where(
      eq(
        foundationalFollowUps.foundationalQuestionId,
        question.foundational_questions.id
      )
    );

  return {
    question: question.foundational_questions,
    followups,
    answer: question.answered_foundational_questions,
  };
}

type FoundationalSystemPageProps = {
  params: Promise<{ system: string }>;
  searchParams: Promise<{ step?: NBMEStep }>;
};

export default async function FoundationalSystemPage({
  params,
  searchParams,
}: FoundationalSystemPageProps) {
  const { id } = await getSession();
  const { system } = await params;
  const { step: stepParam } = await searchParams;
  const currentStep: NBMEStep = stepParam ?? "Step 1";
  const decodedSystem = decodeURIComponent(system);
  const data = await fetchFoundationalQuestion(id, decodedSystem, currentStep);

  if (data === null) return notFound(); // TODO: replace with "completed all questions" page

  const answeredCount = getAnsweredCount(data.answer);

  if (answeredCount === "base")
    return <FoundationalQuestionBase question={data.question} />;

  if (answeredCount >= data.followups.length) {
    // TODO: handle completed follow up access
  }

  const answeredIds = new Set(
    data.answer!.answers.map((a) => a.id)
  );
  const remaining = data.followups.filter(
    (f) => !answeredIds.has(f.id)
  );
  const next = remaining[
    Math.floor(Math.random() * remaining.length)
  ] as FoundationalFollowup;

  return (
    <FoundationalQuestionFollowup
      question={next}
      questionId={data.question.id}
      answers={data.answer!.answers}
      total={data.followups.length}
    />
  );
}

function getAnsweredCount(answer: AnsweredFoundational | null) {
  if (answer === null) return "base";
  return answer.answers.length;
}
