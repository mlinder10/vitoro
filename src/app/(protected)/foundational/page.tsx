import PageTitle from "../_components/page-title";
import { NBME_STEPS, NBMEStep } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { STEP1_SUBJECTS, STEP1_TOPICS, STEP2_SHELVES, STEP2_SYSTEMS } from "@/lib/foundational-data";
import { getSession } from "@/lib/auth";

type FoundationalQuestionsPageProps = {
  searchParams: Promise<{ step?: NBMEStep; subject?: string; shelf?: string }>;
};

export default async function FoundationalQuestionsPage({
  searchParams,
}: FoundationalQuestionsPageProps) {
  await getSession(); // ensure user authenticated
  const {
    step: stepParam,
    subject: subjectParam,
    shelf: shelfParam,
  } = await searchParams;
  const step: NBMEStep = stepParam ?? "Step 1";
  const decodedSubject = subjectParam
    ? decodeURIComponent(subjectParam)
    : undefined;
  const decodedShelf = shelfParam ? decodeURIComponent(shelfParam) : undefined;

  const renderList = (items: string[], hrefBuilder: (item: string) => string) => (
    <div className="space-y-4 p-4">
      {items.map((item) => (
        <div
          key={item}
          className="relative flex justify-between items-center px-6 py-4 hover:pr-2 border rounded-md transition-all"
        >
          <p>{item}</p>
          <ArrowRight size={16} className="text-muted-foreground" />
          <Link href={hrefBuilder(item)} className="absolute inset-0 opacity-0">
            {item}
          </Link>
        </div>
      ))}
    </div>
  );

  let content: JSX.Element;

  if (step === "Step 1") {
    if (!decodedSubject) {
      content = renderList(
        STEP1_SUBJECTS,
        (s) => `?step=${encodeURIComponent(step)}&subject=${encodeURIComponent(s)}`
      );
    } else {
      const topics = STEP1_TOPICS[decodedSubject] ?? [];
      content = renderList(
        topics,
        (t) =>
          `/foundational/${encodeURIComponent(decodedSubject)}?step=${encodeURIComponent(step)}&topic=${encodeURIComponent(t)}`
      );
    }
  } else {
    if (!decodedShelf) {
      content = renderList(
        STEP2_SHELVES,
        (s) => `?step=${encodeURIComponent(step)}&shelf=${encodeURIComponent(s)}`
      );
    } else {
      const systems = STEP2_SYSTEMS[decodedShelf] ?? [];
      content = renderList(
        systems,
        (sys) =>
          `/foundational/${encodeURIComponent(sys)}?step=${encodeURIComponent(step)}&shelf=${encodeURIComponent(decodedShelf)}`
      );
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <PageTitle text="Foundational Questions" />
      <div className="flex gap-2 p-4">
        {NBME_STEPS.filter((s) => s !== "Mixed").map((s) => (
          <Link
            key={s}
            href={`?step=${encodeURIComponent(s)}`}
            className={`px-3 py-1 border rounded-md ${step === s ? "bg-tertiary" : ""}`}
          >
            {s}
          </Link>
        ))}
      </div>
      {content}
    </div>
  );
}
