"use client";

import PaginationFooter from "@/components/pagination-footer";
import Searchbar from "@/components/searchbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import useDeepState from "@/hooks/use-deep-state";
import {
  FoundationalQuestion,
  NBME_STEPS,
  NBMEStep,
  StepOneFoundationalQuestion,
  StepTwoFoundationalQuestion,
} from "@/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchFoundationals } from "./actions";
import { cn } from "@/lib/utils";
import AccentLink from "@/components/accent-link";
import { Edit } from "lucide-react";

export type Filters = {
  step: NBMEStep;
  search: string;
};

const MAX_ITEMS_PER_PAGE = 30;
const DELAY = 500; // 0.5 seconds

export default function FoundationalReviewPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageNum = page ? Number(page) : 1;
  const [filters, updateFilters] = useDeepState<Filters>({
    search: "",
    step: "Step 1",
  });
  const [questions, setQuestions] = useState<FoundationalQuestion[]>([]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      const questions = await fetchFoundationals(
        (pageNum - 1) * MAX_ITEMS_PER_PAGE,
        MAX_ITEMS_PER_PAGE,
        filters
      );
      setQuestions(questions);
    }, DELAY);
    return () => clearTimeout(handler);
  }, [pageNum, filters]);

  return (
    <main className="flex flex-col h-full">
      <section className="flex gap-4 p-4">
        <Searchbar
          placeholder="Search by question stem"
          value={filters.search}
          onChange={(e) =>
            updateFilters((prev) => (prev.search = e.target.value))
          }
        />

        <Select
          value={filters.step}
          onValueChange={(v) =>
            updateFilters((prev) => (prev.step = v as NBMEStep))
          }
        >
          <SelectTrigger>Step</SelectTrigger>
          <SelectContent>
            {NBME_STEPS.map((step) => (
              <SelectItem key={step} value={step}>
                {step}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
      <ul className="flex flex-col flex-1 gap-4 p-4">
        {questions.map((q) => (
          <QuestionRow key={q.id} question={q} />
        ))}
      </ul>
      <div className="p-4">
        <PaginationFooter page={pageNum} />
      </div>
    </main>
  );
}

function QuestionRow({ question }: { question: FoundationalQuestion }) {
  if (question.step === "Step 1") return <StepOneRow question={question} />;
  return <StepTwoRow question={question} />;
}

function StepOneRow({ question }: { question: StepOneFoundationalQuestion }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li className="space-y-2 bg-tertiary p-4 border rounded-md">
      <p
        className={cn("text-sm cursor-pointer", !isExpanded && "line-clamp-2")}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {question.question}
      </p>
      <div className="flex items-center gap-4 text-sm">
        <AccentLink
          href={`/admin/foundational/step-one/${question.id}`}
          className="flex items-center gap-2"
        >
          <span>Edit</span>
          <Edit size={12} />
        </AccentLink>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{question.step}</span>
          <span>•</span>
          <span>{question.subject}</span>
          <span>•</span>
          <span>{question.topic}</span>
          <span>•</span>
          <span>{question.subtopic}</span>
        </div>
      </div>
    </li>
  );
}

function StepTwoRow({ question }: { question: StepTwoFoundationalQuestion }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li className="space-y-2 bg-tertiary p-4 border rounded-md">
      <p
        className={cn("text-sm cursor-pointer", !isExpanded && "line-clamp-2")}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {question.question}
      </p>
      <div className="flex items-center gap-4 text-sm">
        <AccentLink
          href={`/admin/foundational/step-two/${question.id}`}
          className="flex items-center gap-2"
        >
          <span>Edit</span>
          <Edit size={12} />
        </AccentLink>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{question.step}</span>
          <span>•</span>
          <span>{question.shelf}</span>
          <span>•</span>
          <span>{question.system}</span>
          <span>•</span>
          <span>{question.topic}</span>
        </div>
      </div>
    </li>
  );
}
