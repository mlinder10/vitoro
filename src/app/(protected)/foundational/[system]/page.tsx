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
import { AnsweredFoundational } from "@/types";

async function fetchFoundationalQuestion(userId: string, system: string) {
  const [question] = await db
    .select()
    .from(foundationalQuestions)
    .where(
      and(
        eq(foundationalQuestions.system, system),
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
  params: Promise<{
    system: string;
  }>;
};

export default async function FoundationalSystemPage({
  params,
}: FoundationalSystemPageProps) {
  const { id } = await getSession();
  const { system } = await params;
  const decodedSystem = decodeURIComponent(system);
  const data = await fetchFoundationalQuestion(id, decodedSystem);

  if (data === null) return notFound(); // TODO: replace with "completed all questions" page

  const step = getQuestionStep(data.answer);

  if (step === "base")
    return <FoundationalQuestionBase question={data.question} />;

  if (step >= data.followups.length) {
    // TODO: handle completed follow up access
  }

  return <FoundationalQuestionFollowup question={data.followups[step]} />;
}

function getQuestionStep(answer: AnsweredFoundational | null) {
  if (answer === null) return "base";
  return answer.answers.length;
}
