"use client";

import { fetchQuestions } from "@/db/question";
import useInfiniteScroll, { LoadingFooter } from "@/hooks/useInfiniteScroll";
import {
  AnyCategory,
  AnySubcategory,
  AuditStatus,
  ParsedAudit,
  ParsedQuestion,
  QUESTION_TYPES,
  QuestionDifficulty,
  QuestionType,
  System,
  SYSTEMS,
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

const MAX_ITEMS_PER_PAGE = 30;

export default function QuestionReviewListPage() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState<AuditStatus | undefined>();
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
    const { count, questions } = await fetchQuestions(
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
      <section className="flex justify-between items-center px-4">
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
        <ul>
          {questions.map((q) => (
            <QuestionItem key={q.question.id} qa={q} />
          ))}
          {questions.length === 0 && !isLoading && (
            <li>No flagged questions to review.</li>
          )}
        </ul>
        <LoadingFooter isLoading={isLoading} />
      </section>
    </main>
  );
}

// Question Component ---------------------------------------------------------

type QuestionItemProps = {
  qa: {
    question: ParsedQuestion;
    audit: ParsedAudit | null;
  };
  isLast?: boolean;
};

function QuestionItem({ qa, isLast = false }: QuestionItemProps) {
  const { question, audit } = qa;

  function renderAuditStatus() {
    switch (audit?.rating) {
      case "Pass":
        return (
          <span className="flex items-center bg-green-500 px-4 py-1 border-2 border-green-700 rounded-md text-green-950 text-sm">
            Passed
          </span>
        );
      case "Flag for Human Review":
        return (
          <span className="flex items-center bg-yellow-300 px-4 py-1 border-2 border-yellow-500 rounded-md text-yellow-800 text-sm">
            Flagged
          </span>
        );
      case "Reject":
        return (
          <span className="flex items-center bg-red-500 px-4 py-1 border-2 border-red-700 rounded-md text-red-950 text-sm">
            Rejected
          </span>
        );
    }
  }

  return (
    <li className={cn("py-2", !isLast && "border-b-2")}>
      <Link href={`/admin/review/${question.id}`}>
        <div className="flex justify-between">
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
          {renderAuditStatus()}
        </div>
      </Link>
    </li>
  );
}

// Inputs ---------------------------------------------------------------------

type SelectInputsProps = {
  status: AuditStatus | undefined;
  setStatus: (status: AuditStatus | undefined) => void;
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
        updateValue={(value) => setStatus(value as AuditStatus)}
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
