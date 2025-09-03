"use client";

import useInfiniteScroll, { LoadingFooter } from "@/hooks/use-infinite-scroll";
import {
  AnyCategory,
  AnySubcategory,
  AuditRating,
  QUESTION_TYPES,
  QuestionDifficulty,
  QuestionType,
  System,
  SYSTEMS,
  YIELD_TYPES,
  YieldType,
  StepTwoNBMEQuestion,
} from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleHelp, Loader } from "lucide-react";
import { fetchQuestionsWithAudits, updateYieldStatus } from "./actions";
import { toast } from "sonner";

const MAX_ITEMS_PER_PAGE = 30;

export default function QuestionReviewListPage() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<AuditRating | undefined>();
  const [difficulty, setDifficulty] = useState<
    QuestionDifficulty | undefined
  >();
  const [system, setSystem] = useState<System | undefined>();
  const [category, setCategory] = useState<AnyCategory | undefined>();
  const [subcategory, setSubcategory] = useState<AnySubcategory | undefined>();
  const [type, setType] = useState<QuestionType | undefined>();
  const {
    data: questions,
    isLoading,
    containerRef,
  } = useInfiniteScroll(handleFetchQuestions, [
    status,
    difficulty,
    system,
    category,
    subcategory,
    type,
  ]);

  async function handleFetchQuestions(offset: number) {
    const { count, questions } = await fetchQuestionsWithAudits(
      offset,
      MAX_ITEMS_PER_PAGE,
      status,
      difficulty,
      system,
      category,
      subcategory,
      type
    );
    setCount(count);
    return questions;
  }

  return (
    <main className="flex flex-col pb-2 h-page">
      <section className="flex justify-between items-center p-4">
        <div className="flex items-center bg-secondary px-2 border-2 rounded-md h-9">
          <p>Filtered Questions - {count}</p>
        </div>
        <SelectInputs
          status={status}
          setStatus={setStatus}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          system={system}
          setSystem={setSystem}
          category={category}
          setCategory={setCategory}
          subcategory={subcategory}
          setSubcategory={setSubcategory}
          type={type}
          setType={setType}
        />
      </section>
      <section className="flex-1 px-4 overflow-y-auto" ref={containerRef}>
        {questions.length === 0 && !isLoading ? (
          <div className="place-items-center grid px-6 h-full text-muted-foreground text-center">
            <div className="flex flex-col items-center space-y-4">
              <CircleHelp size={60} />
              <p className="font-bold text-2xl">No Questions Found</p>
              <p className="max-w-md text-sm">
                Try adjusting the filters above. You can change the difficulty,
                category, or type to see more results.
              </p>
            </div>
          </div>
        ) : (
          <ul>
            {questions.map((q) => (
              <QuestionItem key={q.id} question={q} />
            ))}
          </ul>
        )}
        <LoadingFooter isLoading={isLoading} />
      </section>
    </main>
  );
}

// Question Component ---------------------------------------------------------

type QuestionItemProps = {
  question: StepTwoNBMEQuestion;
  isLast?: boolean;
};

function QuestionItem({ question, isLast = false }: QuestionItemProps) {
  function renderAuditStatus() {
    switch (question.rating) {
      case "Pass":
        return (
          <span className="flex items-center bg-green-500 px-4 border-2 border-green-700 rounded-md h-9 text-green-950 text-sm">
            Passed
          </span>
        );
      case "Flag for Human Review":
        return (
          <span className="flex items-center bg-yellow-300 px-4 border-2 border-yellow-500 rounded-md h-9 text-yellow-800 text-sm">
            Flagged
          </span>
        );
      case "Reject":
        return (
          <span className="flex items-center bg-red-500 px-4 border-2 border-red-700 rounded-md h-9 text-red-950 text-sm">
            Rejected
          </span>
        );
    }
  }

  return (
    <li className={cn("py-2", !isLast && "border-b-2")}>
      <div className="flex justify-between">
        <Link href={`/admin/review/${question.id}`}>
          <div>
            <div className="flex items-center gap-2">
              <span>{question.system}</span>
              <span>{"-"}</span>
              <span>{question.category}</span>
              <span>{"-"}</span>
              <span>{question.subcategory}</span>
              <span>{"-"}</span>
              <span>{question.type}</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {question.createdAt.toLocaleString()}
            </p>
          </div>
        </Link>
        <div className="flex gap-4">
          <YieldSelect question={question} />
          {renderAuditStatus()}
        </div>
      </div>
    </li>
  );
}

// Yield Select ---------------------------------------------------------------

type YieldSelectProps = {
  question: StepTwoNBMEQuestion;
};

function YieldSelect({ question }: YieldSelectProps) {
  const [value, setValue] = useState<YieldType>(question.yield);
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdateYield(yt: YieldType) {
    setIsLoading(true);
    try {
      await updateYieldStatus(question.id, yt);
      setValue(yt);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update yield status", { richColors: true });
    } finally {
      setIsLoading(false);
    }
  }

  return isLoading ? (
    <div className="flex items-center gap-2 px-2 border rounded-md text-muted-foreground text-sm">
      <span>Updating...</span>
      <Loader className="animate-spin" size={12} />
    </div>
  ) : (
    <Select value={value} onValueChange={handleUpdateYield}>
      <SelectTrigger>
        <SelectValue placeholder="Yield" />
      </SelectTrigger>
      <SelectContent>
        {YIELD_TYPES.map((yt) => (
          <SelectItem key={yt} value={yt}>
            {yt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Inputs ---------------------------------------------------------------------

type SelectInputsProps = {
  status: AuditRating | undefined;
  setStatus: (status: AuditRating | undefined) => void;
  difficulty: QuestionDifficulty | undefined;
  setDifficulty: (difficulty: QuestionDifficulty | undefined) => void;
  system: System | undefined;
  setSystem: (system: System | undefined) => void;
  category: AnyCategory | undefined;
  setCategory: (category: AnyCategory | undefined) => void;
  subcategory: AnySubcategory | undefined;
  setSubcategory: (subcategory: AnySubcategory | undefined) => void;
  type: QuestionType | undefined;
  setType: (type: QuestionType | undefined) => void;
};

function SelectInputs({
  status,
  setStatus,
  difficulty,
  setDifficulty,
  system,
  setSystem,
  category,
  setCategory,
  subcategory,
  setSubcategory,
  type,
  setType,
}: SelectInputsProps) {
  return (
    <div className="flex gap-2">
      <SimpleSelect
        value={status}
        updateValue={(value) => setStatus(value as AuditRating)}
        options={[
          { value: "Pass", label: "Passed" },
          { value: "Flag for Human Review", label: "Flagged" },
          { value: "Reject", label: "Rejected" },
        ]}
        placeholder="Audit Status"
      />
      <SimpleSelect
        value={difficulty}
        updateValue={(value) => setDifficulty(value as QuestionDifficulty)}
        options={[
          { value: "easy", label: "Easy" },
          { value: "moderate", label: "Medium" },
          { value: "hard", label: "Hard" },
        ]}
        placeholder="Difficulty"
      />
      <SimpleSelect
        value={system}
        updateValue={(value) => setSystem(value as System)}
        options={SYSTEMS.map((s) => ({ value: s.name, label: s.name }))}
        placeholder="System"
      />
      {system && (
        <SimpleSelect
          value={category}
          updateValue={(value) => setCategory(value as AnyCategory)}
          options={
            SYSTEMS.find((s) => s.name === system)?.categories.map((c) => ({
              value: c.name,
              label: c.name,
            })) ?? []
          }
          placeholder="Category"
        />
      )}
      {category && (
        <SimpleSelect
          value={subcategory}
          updateValue={(value) => setSubcategory(value as AnySubcategory)}
          options={
            SYSTEMS.find((s) => s.name === system)
              ?.categories.find((c) => c.name === category)
              ?.subcategories.map((s) => ({ value: s, label: s })) ?? []
          }
          placeholder="Subcategory"
        />
      )}
      <SimpleSelect
        value={type}
        updateValue={(value) => setType(value as QuestionType)}
        options={QUESTION_TYPES.map((t) => ({ value: t, label: t }))}
        placeholder="Question Type"
      />
    </div>
  );
}

type SimpleSelectProps<T> = {
  value: T | undefined;
  updateValue: (value: T | undefined) => void;
  options: { value: T; label: string }[];
  placeholder?: string;
};

const ALL_SELECT_VALUE = "__reserved_select_all__";

function SimpleSelect<T extends string>({
  value,
  updateValue,
  options,
  placeholder = "Select",
}: SimpleSelectProps<T>) {
  function onValueChange(value: string) {
    if (value === ALL_SELECT_VALUE) return updateValue(undefined);
    updateValue(value as T);
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_SELECT_VALUE}>All</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
