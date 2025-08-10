"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NBME_STEPS,
  NBMEStep,
  QUESTION_DIFFICULTIES,
  QUESTION_TYPES,
  QuestionDifficulty,
  QuestionType,
  SYSTEMS,
} from "@/types";
import {
  DEFAULT_QUESTION_COUNT,
  useQBankSession,
} from "@/contexts/qbank-session-provider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CircleSlash,
  Clock,
  Computer,
  ChevronRight,
} from "lucide-react";
import { useSession } from "@/contexts/session-provider";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type DbRow = {
  system: string;
  category: string;
  subcategory: string;
  type: string;
};

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
    system,
    // setSystem,
    category,
    setCategory,
    subcategory,
    setSubcategory,
    topic,
    setTopic,
    difficulty,
    setDifficulty,
    setQuestionCount,
    availableCount,
    refreshAvailableCount,
    groupedCounts,
    refreshGroupedCounts,
    startSession,
  } = useQBankSession();
  const [tmpCount, setTmpCount] = useState<number | "">(DEFAULT_QUESTION_COUNT);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedKeys, setSelectedKeys] = useState<Record<string, boolean>>({});
  const [dbRows, setDbRows] = useState<DbRow[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dbError, setDbError] = useState<string | null>(null);

  async function handleStartSession(filter = true) {
    if (tmpCount === "")
      return toast.error("Please enter a question count", { richColors: true });
    if (effectiveAvailableCount === 0)
      return toast.error("No questions match your current filters", {
        richColors: true,
      });
    if (typeof tmpCount === "number" && tmpCount > effectiveAvailableCount)
      return toast.error(
        `Only ${effectiveAvailableCount} questions available for current filters`,
        {
          richColors: true,
        }
      );
    if (tmpCount < 0 || tmpCount > 50)
      return toast.error("Question count must be between 1 and 50", {
        richColors: true,
      });
    setIsLoading(true);
    await startSession(id, filter);
    setIsLoading(false);
    router.replace(`/practice/questions`);
  }

  const treeData = useMemo(() => {
    if (dbRows.length > 0) {
      const map = new Map<string, Map<string, Set<string>>>();
      for (const r of dbRows) {
        if (!map.has(r.system)) map.set(r.system, new Map());
        const catMap = map.get(r.system)!;
        if (!catMap.has(r.category)) catMap.set(r.category, new Set());
        catMap.get(r.category)!.add(r.subcategory);
      }
      return Array.from(map.entries()).map(([sys, catMap]) => ({
        system: sys,
        categories: Array.from(catMap.entries()).map(([cat, subs]) => ({
          name: cat,
          subcategories: Array.from(subs.values()),
        })),
      }));
    }
    return SYSTEMS.map((s) => ({
      system: s.name,
      categories: s.categories.map((c) => ({
        name: c.name,
        subcategories: c.subcategories,
      })),
    }));
  }, [dbRows]);

  const getCountFor = useCallback(
    (systemName?: string, categoryName?: string, subcategoryName?: string) => {
      if (!systemName) return 0;
      if (!categoryName) return groupedCounts[`${systemName}__`] ?? 0;
      if (!subcategoryName)
        return groupedCounts[`${systemName}__${categoryName}__`] ?? 0;
      return (
        groupedCounts[`${systemName}__${categoryName}__${subcategoryName}`] ?? 0
      );
    },
    [groupedCounts]
  );

  function toggleSelect(pathKey: string, checked: boolean) {
    setSelectedKeys((prev) => ({ ...prev, [pathKey]: checked }));
  }

  function getLeafKeysForSystem(systemName: string) {
    const sys = treeData.find((s) => s.system === systemName);
    if (!sys) return [] as string[];
    const keys: string[] = [];
    for (const c of sys.categories) {
      for (const sub of c.subcategories)
        keys.push(`${systemName}__${c.name}__${sub}`);
    }
    return keys;
  }

  function getLeafKeysForCategory(systemName: string, categoryName: string) {
    const sys = treeData.find((s) => s.system === systemName);
    const cat = sys?.categories.find((c) => c.name === categoryName);
    if (!cat) return [] as string[];
    return cat.subcategories.map(
      (sub) => `${systemName}__${categoryName}__${sub}`
    );
  }

  function isSystemChecked(systemName: string) {
    const keys = getLeafKeysForSystem(systemName);
    return keys.length > 0 && keys.every((k) => !!selectedKeys[k]);
  }

  function isCategoryChecked(systemName: string, categoryName: string) {
    const keys = getLeafKeysForCategory(systemName, categoryName);
    return keys.length > 0 && keys.every((k) => !!selectedKeys[k]);
  }

  const selectedAvailableCount = useMemo(() => {
    const leafKeys = Object.entries(selectedKeys)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (leafKeys.length === 0) return 0;
    let total = 0;
    for (const key of leafKeys) {
      const [sys, cat, sub] = key.split("__");
      total += getCountFor(sys, cat, sub);
    }
    return total;
  }, [selectedKeys, getCountFor]);

  const effectiveAvailableCount =
    selectedAvailableCount > 0 ? selectedAvailableCount : availableCount;

  function toggleExpanded(pathKey: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(pathKey)) next.delete(pathKey);
      else next.add(pathKey);
      return next;
    });
  }

  function resetAll() {
    setStep(undefined);
    setType(undefined);
    setDifficulty(undefined);
    setCategory(undefined);
    setSubcategory(undefined);
    setTopic("");
    setStatus("Unanswered");
    setSelectedKeys({});
    setExpandedItems(new Set());
    setTmpCount(DEFAULT_QUESTION_COUNT);
    if (id) {
      refreshAvailableCount(id);
      refreshGroupedCounts(id);
    }
  }

  useEffect(() => {
    if (tmpCount !== "") setQuestionCount(tmpCount);
  }, [tmpCount, setQuestionCount]);

  useEffect(() => {
    setCategory(undefined);
    setSubcategory(undefined);
  }, [system, setCategory, setSubcategory]);

  useEffect(() => {
    setSubcategory(undefined);
  }, [category, setSubcategory]);

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
    system,
    category,
    subcategory,
    topic,
    difficulty,
    // refreshAvailableCount,
    // refreshGroupedCounts,
  ]);

  // TODO: maybe find a better way of doing this (if consuming too much memory on the client)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/tmp", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as DbRow[];
        if (isMounted) setDbRows(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setDbError((err as Error)?.message ?? "Unknown error");
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (
      effectiveAvailableCount > 0 &&
      typeof tmpCount === "number" &&
      tmpCount > effectiveAvailableCount
    ) {
      setTmpCount(effectiveAvailableCount);
    }
  }, [effectiveAvailableCount, tmpCount]);

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
                onSelect={() => setStatus("Unanswered")}
              />
              <StatusPill
                current={status}
                value="Answered"
                onSelect={() => setStatus("Answered")}
              />
              <StatusPill
                current={status}
                value="Correct"
                onSelect={() => setStatus("Correct")}
              />
              <StatusPill
                current={status}
                value="Incorrect"
                onSelect={() => setStatus("Incorrect")}
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
              checked={
                Object.keys(selectedKeys).length > 0 &&
                Object.values(selectedKeys).every(Boolean)
              }
              onChange={(e) => {
                const next: Record<string, boolean> = {};
                for (const s of treeData) {
                  for (const c of s.categories) {
                    for (const sub of c.subcategories) {
                      next[`${s.system}__${c.name}__${sub}`] = e.target.checked;
                    }
                  }
                }
                setSelectedKeys(next);
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
            <span>Select All</span>
          </label>
        </div>
        <div className="divide-y">
          {treeData.map((s) => (
            <TreeRow
              key={s.system}
              level={0}
              label={s.system}
              count={getCountFor(s.system)}
              expanded={expandedItems.has(`${s.system}__`)}
              onToggle={() => toggleExpanded(`${s.system}__`)}
              checked={isSystemChecked(s.system)}
              onCheckedChange={(val) => {
                const leaves = getLeafKeysForSystem(s.system);
                setSelectedKeys((prev) => {
                  const next = { ...prev };
                  for (const k of leaves) next[k] = val;
                  return next;
                });
              }}
              childrenFn={() =>
                s.categories.map((c) => (
                  <TreeRow
                    key={`${s.system}__${c.name}`}
                    level={1}
                    label={c.name}
                    count={getCountFor(s.system, c.name)}
                    expanded={expandedItems.has(`${s.system}__${c.name}__`)}
                    onToggle={() => toggleExpanded(`${s.system}__${c.name}__`)}
                    checked={isCategoryChecked(s.system, c.name)}
                    onCheckedChange={(val) => {
                      const leaves = getLeafKeysForCategory(s.system, c.name);
                      setSelectedKeys((prev) => {
                        const next = { ...prev };
                        for (const k of leaves) next[k] = val;
                        return next;
                      });
                    }}
                    childrenFn={() =>
                      c.subcategories.map((sub) => (
                        <TreeRow
                          key={`${s.system}__${c.name}__${sub}`}
                          level={2}
                          label={sub}
                          count={getCountFor(s.system, c.name, sub)}
                          checked={
                            !!selectedKeys[`${s.system}__${c.name}__${sub}`]
                          }
                          onCheckedChange={(val) =>
                            toggleSelect(`${s.system}__${c.name}__${sub}`, val)
                          }
                        />
                      ))
                    }
                  />
                ))
              }
            />
          ))}
        </div>
      </div>

      {/* Footer with availability left, question count right */}
      <div className="flex justify-between items-end mt-6">
        <p className="text-muted-foreground text-sm">
          {effectiveAvailableCount} questions available for current filters
        </p>
        <div className="flex items-end gap-4">
          <div className="space-y-1">
            <Label>Question Count</Label>
            <Input
              type="number"
              min={1}
              max={Math.min(50, Math.max(effectiveAvailableCount, 1))}
              placeholder="Question Count"
              value={tmpCount}
              onChange={(e) =>
                setTmpCount(e.target.value ? e.target.valueAsNumber : "")
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

type FormSelectProps<T> = {
  label: string;
  value: T | undefined;
  updateValue: (value: T | undefined) => void;
  options: Readonly<T[]>;
  placeholder?: string;
  disabled?: boolean;
};

type TreeRowProps = {
  level: number;
  label: string;
  count: number;
  expanded?: boolean;
  onToggle?: () => void;
  childrenFn?: () => ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

function TreeRow({
  level,
  label,
  count,
  expanded,
  onToggle,
  childrenFn,
  checked = false,
  onCheckedChange,
}: TreeRowProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const contentStyles = {
    maxHeight:
      expanded && contentRef.current
        ? `${contentRef.current.scrollHeight}px`
        : "0px",
    opacity: expanded ? 1 : 0,
    transform: expanded ? "translateY(0)" : "translateY(-10px)",
    transition: "all 300ms ease-in-out",
  } as React.CSSProperties;

  return (
    <div
      className="hover:bg-gray-100 dark:hover:bg-neutral-800 p-2 rounded transition-colors cursor-pointer select-none"
      style={{ paddingLeft: level * 24 + 12 }}
      onClick={(e) => {
        if (childrenFn) {
          e.stopPropagation();
          if (onToggle) {
            onToggle();
          }
        }
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {childrenFn ? (
            <button
              type="button"
              className="hover:bg-gray-200 dark:hover:bg-neutral-700 p-0 rounded w-6 h-6"
              onClick={(e) => {
                e.stopPropagation();
                if (onToggle) {
                  onToggle();
                }
              }}
            >
              <ChevronRight
                className="transition-transform duration-200"
                style={{
                  transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                }}
              />
            </button>
          ) : (
            <div className="w-6 h-6" />
          )}
          {onCheckedChange && (
            <label
              className="flex items-center space-x-3 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
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
            </label>
          )}
          <div className={level === 0 ? "font-medium" : undefined}>{label}</div>
          <span className="text-muted-foreground">({count})</span>
        </div>
      </div>
      <div
        ref={contentRef}
        style={contentStyles}
        className="overflow-hidden will-change-[max-height,opacity,transform]"
      >
        {childrenFn ? (
          <div className="space-y-1 mt-1">{childrenFn()}</div>
        ) : null}
      </div>
    </div>
  );
}

function FormSelect<T extends string>({
  label,
  value,
  updateValue,
  options,
  placeholder,
  disabled,
}: FormSelectProps<T>) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2 w-full">
        <Select value={value ?? ""} onValueChange={(v) => updateValue(v as T)}>
          <SelectTrigger
            className="flex-1"
            data-disabled={disabled}
            aria-disabled={disabled}
            disabled={disabled}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="accent-tertiary"
          onClick={() => updateValue(undefined)}
          disabled={disabled}
        >
          <span>Clear</span>
          <CircleSlash />
        </Button>
      </div>
    </div>
  );
}

type StatusPillProps = {
  current: "Unanswered" | "Answered" | "Correct" | "Incorrect";
  value: "Unanswered" | "Answered" | "Correct" | "Incorrect";
  onSelect: () => void;
  count?: number;
};

function StatusPill({ current, value, onSelect, count }: StatusPillProps) {
  const checked = current === value;

  const colorSchemes = {
    Unanswered: {
      active: "bg-blue-100 text-blue-700 border-blue-200",
      inactive: "bg-white text-gray-600 border-gray-200 hover:bg-gray-50",
    },
    Answered: {
      active: "bg-purple-100 text-purple-700 border-purple-200",
      inactive: "bg-white text-gray-600 border-gray-200 hover:bg-gray-50",
    },
    Correct: {
      active: "bg-green-100 text-green-700 border-green-200",
      inactive: "bg-white text-gray-600 border-gray-200 hover:bg-gray-50",
    },
    Incorrect: {
      active: "bg-red-100 text-red-700 border-red-200",
      inactive: "bg-white text-gray-600 border-gray-200 hover:bg-gray-50",
    },
  } as const;

  const colors = colorSchemes[value];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        inline-flex items-center gap-2
        px-4 py-2
        rounded-lg
        border
        font-medium
        transition-all duration-200
        ${checked ? colors.active : colors.inactive}
        ${checked ? "shadow-sm" : "hover:shadow-sm"}
      `}
    >
      <div
        className={`
          w-4 h-4
          rounded
          border-2
          transition-all duration-200
          flex items-center justify-center
          ${checked ? "border-current bg-current" : "border-gray-300 bg-white"}
        `}
      >
        {checked && (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
          </svg>
        )}
      </div>

      <span className="text-sm">{value}</span>

      {count !== undefined && (
        <span
          className={`text-sm ${checked ? "font-semibold" : "text-gray-500"}`}
        >
          ({count})
        </span>
      )}
    </button>
  );
}
