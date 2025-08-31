import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QBankStatus } from "@/contexts/qbank-session-provider";
import { ChevronRight, CircleSlash } from "lucide-react";
import { ReactNode, useRef, useState } from "react";

type StatusPillProps = {
  current: QBankStatus[];
  value: QBankStatus;
  onSelect: () => void;
  count?: number;
};

export function StatusPill({
  current,
  value,
  onSelect,
  count,
}: StatusPillProps) {
  const checked = current.includes(value);

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

type FormSelectProps<T> = {
  label: string;
  value: T | undefined;
  updateValue: (value: T | undefined) => void;
  options: Readonly<T[]>;
  placeholder?: string;
  disabled?: boolean;
};

export function FormSelect<T extends string>({
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
          variant="accent"
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

type TreeRowProps = {
  children?: ReactNode;
  level: number;
  label: string;
  count: number;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function TreeRow({
  children,
  level,
  label,
  count,
  checked = false,
  onCheckedChange,
}: TreeRowProps) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="hover:bg-gray-100 dark:hover:bg-neutral-800 p-2 rounded transition-colors cursor-pointer select-none"
      style={{ paddingLeft: level * 24 + 12 }}
      onClick={(e) => {
        if (children) {
          e.stopPropagation();
          setExpanded(true);
        }
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {children ? (
            <button
              type="button"
              className="hover:bg-gray-200 dark:hover:bg-neutral-700 p-0 rounded w-6 h-6"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
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
        className="overflow-hidden will-change-[max-height,opacity,transform]"
      >
        {expanded && children ? (
          <div className="space-y-1 mt-1">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
