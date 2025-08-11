"use client";

import {
  AnyCategory,
  AnySubcategory,
  getCategories,
  getSubcategories,
  NBME_STEPS,
  NBMEStep,
  QUESTION_DIFFICULTIES,
  QUESTION_TYPES,
  QuestionDifficulty,
  QuestionType,
  System,
  SYSTEMS,
} from "@/types";
import {
  DEFAULT_QUESTION_COUNT,
  QBankStatus,
  useQBankSession,
} from "@/contexts/qbank-session-provider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Computer } from "lucide-react";
import { useSession } from "@/contexts/session-provider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FormSelect, StatusPill, TreeRow } from "./form-components";

export default function CustomSessionForm() {
  const router = useRouter();
  const { id } = useSession();
  const {
    step,
    setStep,
    mode,
    setMode,
    type,
    setType,
    status,
    setStatus,
    selected,
    setSelected,
    difficulty,
    setDifficulty,
    setQuestionCount,
    availableCount,
    refreshAvailableCount,
    groupedCounts,
    refreshGroupedCounts,
    startSession,
  } = useQBankSession();
  const [qCountInput, setQCountInput] = useState<number | "">(
    DEFAULT_QUESTION_COUNT
  );
  const [isLoading, setIsLoading] = useState(false);

  const getCountForSystem = useCallback(
    (system?: System) => (system ? (groupedCounts[system] ?? 0) : 0),
    [groupedCounts]
  );
  const getCountForCategory = useCallback(
    (category?: AnyCategory) => (category ? (groupedCounts[category] ?? 0) : 0),
    [groupedCounts]
  );
  const getCountForSubcategory = useCallback(
    (subcategory?: AnySubcategory) =>
      subcategory ? (groupedCounts[subcategory] ?? 0) : 0,
    [groupedCounts]
  );

  const selectedAvailableCount = useMemo(() => {
    if (selected.subcategories.size === 0) return availableCount;
    let total = 0;
    for (const sub of selected.subcategories) {
      total += getCountForSubcategory(sub);
    }
    return total;
  }, [selected, availableCount, getCountForSubcategory]);

  async function handleStartSession(filter = true) {
    if (qCountInput === "")
      return toast.error("Please enter a question count", { richColors: true });
    if (selectedAvailableCount === 0)
      return toast.error("No questions match your current filters", {
        richColors: true,
      });
    if (typeof qCountInput === "number" && qCountInput > selectedAvailableCount)
      return toast.error(
        `Only ${selectedAvailableCount} questions available for current filters`,
        {
          richColors: true,
        }
      );
    if (qCountInput < 0 || qCountInput > 50)
      return toast.error("Question count must be between 1 and 50", {
        richColors: true,
      });
    setIsLoading(true);
    await startSession(id, filter);
    setIsLoading(false);
    router.replace(`/practice/questions`);
  }

  function resetAll() {
    setStep(undefined);
    setType(undefined);
    setDifficulty(undefined);
    setSelected((prev) => {
      prev.systems.clear();
      prev.categories.clear();
      prev.subcategories.clear();
    });
    setStatus([]);
    setQCountInput(DEFAULT_QUESTION_COUNT);
    if (id) {
      refreshAvailableCount(id);
      refreshGroupedCounts(id);
    }
  }

  // TODO: toggle children
  function handleToggleSystem(system: System) {
    setSelected((prev) => {
      if (prev.systems.has(system)) prev.systems.delete(system);
      else {
        prev.systems.add(system);
        SYSTEMS.find((s) => s.name === system)?.categories.forEach((c) => {
          prev.categories.add(c.name);
          c.subcategories.forEach((sc) => {
            prev.subcategories.add(sc);
          });
        });
      }
    });
  }

  function handleToggleCategory(category: AnyCategory) {
    setSelected((prev) => {
      if (prev.categories.has(category)) prev.categories.delete(category);
      else {
        prev.categories.add(category);
        SYSTEMS.flatMap((s) => s.categories)
          .find((c) => c.name === category)
          ?.subcategories.forEach((sc) => prev.subcategories.add(sc));
      }
    });
  }

  function handleToggleSubcategory(subcategory: AnySubcategory) {
    setSelected((prev) => {
      if (prev.subcategories.has(subcategory))
        prev.subcategories.delete(subcategory);
      else prev.subcategories.add(subcategory);
    });
  }

  function handleToggleStatus(s: QBankStatus) {
    const index = status.indexOf(s);
    if (index === -1) setStatus((prev) => [...prev, s]);
    else setStatus((prev) => prev.filter((p) => p !== s));
  }

  useEffect(() => {
    if (qCountInput !== "") setQuestionCount(qCountInput);
  }, [qCountInput, setQuestionCount]);

  useEffect(() => {
    if (!id) return;
    const t = setTimeout(() => {
      refreshAvailableCount(id);
      refreshGroupedCounts(id);
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    step,
    type,
    status,
    selected.systems,
    selected.categories,
    selected.subcategories,
    difficulty,
  ]);

  useEffect(() => {
    if (
      selectedAvailableCount > 0 &&
      typeof qCountInput === "number" &&
      qCountInput > selectedAvailableCount
    ) {
      setQCountInput(selectedAvailableCount);
    }
  }, [selectedAvailableCount, qCountInput]);

  return (
    <div className="flex flex-col px-6 pb-8">
      {/* Header and filters */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="font-semibold">Settings</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-2">
              <Button
                variant={mode === "tutor" ? "accent" : "outline"}
                onClick={() => setMode("tutor")}
              >
                <Computer />
                <span>Tutor</span>
              </Button>
              <Button
                variant={mode === "timed" ? "accent" : "outline"}
                onClick={() => setMode("timed")}
              >
                <Clock />
                <span>Timed</span>
              </Button>
            </div>
            <div className="flex items-center gap-4 ml-8">
              <StatusPill
                current={status}
                value="Unanswered"
                onSelect={() => handleToggleStatus("Unanswered")}
              />
              <StatusPill
                current={status}
                value="Answered"
                onSelect={() => handleToggleStatus("Answered")}
              />
              <StatusPill
                current={status}
                value="Correct"
                onSelect={() => handleToggleStatus("Correct")}
              />
              <StatusPill
                current={status}
                value="Incorrect"
                onSelect={() => handleToggleStatus("Incorrect")}
              />
            </div>
            <div className="ml-auto">
              <Button variant="destructive" onClick={resetAll}>
                Reset
              </Button>
            </div>
          </div>
          {/* Moved below the flex row as stacked controls */}
          <div className="space-y-2 mt-2">
            <FormSelect
              label="Step"
              value={step}
              updateValue={(s) => setStep(s as NBMEStep)}
              options={NBME_STEPS}
              placeholder="Step"
            />
            <FormSelect
              label="Difficulty"
              value={difficulty}
              updateValue={(d) => setDifficulty(d as QuestionDifficulty)}
              options={QUESTION_DIFFICULTIES}
              placeholder="Difficulty"
            />
            <FormSelect
              label="Question Type"
              value={type}
              updateValue={(t) => setType(t as QuestionType)}
              options={QUESTION_TYPES}
              placeholder="Question Type"
            />
          </div>
        </div>
      </div>

      {/* Multi-level dropdown structure */}
      <div className="mt-6 border rounded-md">
        {/* Header row with SYSTEM and Select All */}
        <div className="flex justify-between items-center p-2">
          <div className="pl-3">
            <span className="font-medium text-muted-foreground text-xs tracking-wider">
              SYSTEM
            </span>
          </div>
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={selected.systems.size === SYSTEMS.length}
              onChange={() => {
                setSelected((prev) => {
                  if (selected.systems.size > 0) {
                    prev.systems.clear();
                    prev.categories.clear();
                    prev.subcategories.clear();
                  } else {
                    prev.systems = new Set(
                      SYSTEMS.map((s) => s.name as System)
                    );
                    prev.categories = new Set(
                      SYSTEMS.flatMap((s) => s.categories).map((c) => c.name)
                    );
                    prev.subcategories = new Set(
                      SYSTEMS.flatMap((s) => s.categories).flatMap(
                        (c) => c.subcategories
                      )
                    );
                  }
                });
              }}
            />
            <div className="relative peer-checked:bg-blue-600 border-2 border-gray-300 peer-checked:border-blue-600 rounded peer-focus:ring-2 peer-focus:ring-blue-500 w-5 h-5 transition-all duration-200">
              <svg
                className="absolute inset-0 w-full h-full text-white scale-0 peer-checked:scale-100 transition-transform duration-200"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  d="M13.5 3.5L6 11l-3.5-3.5L1 9l5 5L15 5z"
                />
              </svg>
            </div>
            <span>
              {selected.systems.size > 0 ? "Deselect All" : "Select All"}
            </span>
          </label>
        </div>
        <div className="divide-y">
          {SYSTEMS.map((s) => s.name as System).map((s) => (
            <TreeRow
              key={s}
              level={0}
              label={s}
              count={getCountForSystem(s)}
              checked={selected.systems.has(s)}
              onCheckedChange={() => handleToggleSystem(s)}
            >
              {getCategories(s).map((c) => (
                <TreeRow
                  key={c}
                  level={1}
                  label={c}
                  count={getCountForCategory(c)}
                  checked={selected.categories.has(c)}
                  onCheckedChange={() => handleToggleCategory(c)}
                >
                  {getSubcategories(c).map((sc) => (
                    <TreeRow
                      key={sc}
                      level={2}
                      label={sc}
                      count={getCountForSubcategory(sc)}
                      checked={selected.subcategories.has(sc)}
                      onCheckedChange={() => handleToggleSubcategory(sc)}
                    />
                  ))}
                </TreeRow>
              ))}
            </TreeRow>
          ))}
        </div>
      </div>

      {/* Footer with availability left, question count right */}
      <div className="flex justify-between items-end mt-6">
        <p className="text-muted-foreground text-sm">
          {selectedAvailableCount} questions available for current filters
        </p>
        <div className="flex items-end gap-4">
          <div className="space-y-1">
            <Label>Question Count</Label>
            <Input
              type="number"
              min={1}
              max={Math.min(50, Math.max(selectedAvailableCount, 1))}
              placeholder="Question Count"
              value={qCountInput}
              onChange={(e) =>
                setQCountInput(e.target.value ? e.target.valueAsNumber : "")
              }
              className="pr-4 w-36"
            />
          </div>
          <Button
            variant="accent"
            onClick={() => handleStartSession(true)}
            disabled={isLoading}
          >
            <span>Start Session</span>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
