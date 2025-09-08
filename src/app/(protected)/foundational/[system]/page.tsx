import { FoundationalQuestionFlow } from "./_components/foundational-question-view";
import { fetchFoundational } from "./actions";
import { NBMEStep } from "@/types";

type FoundationalSystemPageProps = {
  params: Promise<{ system: string }>;
  searchParams: Promise<{ step?: NBMEStep; topic?: string; shelf?: string }>;
};

export default async function FoundationalSystemPage({
  params,
  searchParams,
}: FoundationalSystemPageProps) {
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

  const data = await fetchFoundational({
    step: currentStep,
    system: decodedSystem,
    topic: decodedTopic,
  });

  console.log("filtered result length", data ? 1 : 0);

  if (data === null)
    return (
      <div className="p-4">
        No foundational questions found for the selected parameters.
      </div>
    );

  return (
    <FoundationalQuestionFlow
      key={data.question.id}
      question={data.question}
      followups={data.followups}
      initialAnswer={data.answer}
    />
  );
}
