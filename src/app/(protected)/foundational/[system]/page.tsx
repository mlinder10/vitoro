import {
  answeredFoundationals,
  db,
  foundationalFollowUps,
  foundationalQuestions,
} from "@/db";
import { getSession } from "@/lib/auth";
import { eq, and, isNull, or, sql } from "drizzle-orm";
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
  step: NBMEStep,
  topic?: string
) {
  const normalizedSystem = system.trim().toLowerCase();
  const normalizedTopic = topic?.trim().toLowerCase();

  const results = await db
    .select()
    .from(foundationalQuestions)
    .where(
      and(
        sql`lower(${foundationalQuestions.system}) = ${normalizedSystem}`,
        eq(foundationalQuestions.step, step),
        normalizedTopic
          ? sql`lower(${foundationalQuestions.topic}) = ${normalizedTopic}`
          : sql`1 = 1`,
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

  console.log("fetchFoundationalQuestion", {
    system: normalizedSystem,
    topic: normalizedTopic,
    length: results.length,
  });

  const [question] = results;
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
  searchParams: Promise<{ step?: NBMEStep; topic?: string; shelf?: string }>;
};

export default async function FoundationalSystemPage({
  params,
  searchParams,
}: FoundationalSystemPageProps) {
  const { id } = await getSession();
  const { system } = await params;
  const {
    step: stepParam,
    topic: topicParam,
    shelf: shelfParam,
  } = await searchParams;
  const currentStep: NBMEStep = stepParam ?? "Step 1";
  const decodedSystem = decodeURIComponent(system);
  const decodedTopic = topicParam ? decodeURIComponent(topicParam) : undefined;
  const decodedShelf = shelfParam ? decodeURIComponent(shelfParam) : undefined;

  console.log("decoded params", {
    system: decodedSystem,
    topic: decodedTopic,
    shelf: decodedShelf,
  });

  const data = await fetchFoundationalQuestion(
    id,
    decodedSystem,
    currentStep,
    decodedTopic
  );

  console.log("filtered result length", data ? 1 : 0);

  if (data === null)
    return (
      <div className="p-4">
        No foundational questions found for the selected parameters.
      </div>
    );

  const answeredCount = getAnsweredCount(data.answer);

  if (answeredCount === "base")
    return (
      <FoundationalQuestionBase
        key={data.question.id}
        question={data.question}
        total={data.followups.length + 1}
      />
    );

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
      key={next.id}
      question={next}
      questionId={data.question.id}
      answers={data.answer!.answers}
      total={data.followups.length}
    />
  );
}

function getAnsweredCount(answer: AnsweredFoundational | null) {
  if (!answer || answer.shortResponse.trim() === "") return "base";
  return answer.answers.length;
}
