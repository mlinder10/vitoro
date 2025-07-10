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
  System,
  SYSTEMS,
} from "@/types";
import { useQBankSession } from "@/contexts/qbank-session-provider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CircleSlash, FocusIcon, Shuffle } from "lucide-react";
import { useSession } from "@/contexts/session-provider";
import { useState } from "react";

export default function CustomSessionForm() {
  const { id } = useSession();
  const {
    step,
    setStep,
    type,
    setType,
    system,
    setSystem,
    difficulty,
    setDifficulty,
    fetchQuestion,
  } = useQBankSession();
  const [isLoading, setIsLoading] = useState(false);

  async function handleFetchQuestion(filter = true) {
    setIsLoading(true);
    await fetchQuestion(id, filter);
    setIsLoading(false);
  }

  return (
    <div className="gap-8 grid grid-cols-2 px-6 pb-8">
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-semibold">Random Session</h2>
          <p className="text-muted-foreground text-sm">
            Practice with a random selection of questions.
          </p>
        </div>
        <Button
          variant="accent"
          onClick={() => handleFetchQuestion(false)}
          disabled={isLoading}
        >
          <span>Random Session</span>
          <Shuffle />
        </Button>
      </section>
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-semibold">Custom Session</h2>
          <p className="text-muted-foreground text-sm">
            Target your weak areas with focused review questions.
          </p>
        </div>
        <div className="space-y-4">
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
          <FormSelect
            label="System"
            value={system}
            updateValue={(s) => setSystem(s as System)}
            options={SYSTEMS.map((s) => s.name)}
            placeholder="System"
          />
          <Button
            variant="accent"
            onClick={() => handleFetchQuestion(true)}
            disabled={isLoading}
          >
            <span>Custom Session</span>
            <FocusIcon />
          </Button>
        </div>
      </section>
    </div>
  );
}

type FormSelectProps<T> = {
  label: string;
  value: T | undefined;
  updateValue: (value: T | undefined) => void;
  options: Readonly<T[]>;
  placeholder?: string;
};

function FormSelect<T extends string>({
  label,
  value,
  updateValue,
  options,
  placeholder,
}: FormSelectProps<T>) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2 w-full">
        <Select value={value} onValueChange={(v) => updateValue(v as T)}>
          <SelectTrigger className="flex-1">
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
        >
          <span>Clear</span>
          <CircleSlash />
        </Button>
      </div>
    </div>
  );
}
