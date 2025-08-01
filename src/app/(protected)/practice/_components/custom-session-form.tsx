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
import {
  DEFAULT_QUESTION_COUNT,
  useQBankSession,
} from "@/contexts/qbank-session-provider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, CircleSlash, Clock, Computer } from "lucide-react";
import { useSession } from "@/contexts/session-provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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
    system,
    setSystem,
    difficulty,
    setDifficulty,
    setQuestionCount,
    startSession,
  } = useQBankSession();
  const [tmpCount, setTmpCount] = useState<number | "">(DEFAULT_QUESTION_COUNT);
  const [isLoading, setIsLoading] = useState(false);

  async function handleStartSession(filter = true) {
    if (tmpCount === "")
      return toast.error("Please enter a question count", { richColors: true });
    if (tmpCount < 0 || tmpCount > 50)
      return toast.error("Question count must be between 1 and 50", {
        richColors: true,
      });
    setIsLoading(true);
    await startSession(id, filter);
    setIsLoading(false);
    router.replace(`/practice/questions`);
  }

  useEffect(() => {
    if (tmpCount !== "") setQuestionCount(tmpCount);
  }, [tmpCount, setQuestionCount]);

  return (
    <div className="flex flex-col">
      <div className="gap-8 grid grid-cols-2 px-6 pb-8">
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-semibold">Required Settings</h2>
            <p className="text-muted-foreground text-sm">
              Practice with a random selection of questions.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Practice Mode</Label>
              <div className="flex gap-4">
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
            </div>
            <div className="space-y-2">
              <Label>Question Count</Label>
              <Input
                type="number"
                min={1}
                max={50}
                placeholder="Question Count"
                value={tmpCount}
                onChange={(e) =>
                  setTmpCount(e.target.value ? e.target.valueAsNumber : "")
                }
              />
            </div>
          </div>
        </section>
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-semibold">Optional Settings</h2>
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
          </div>
        </section>
      </div>
      <Button
        variant="accent"
        onClick={() => handleStartSession(true)}
        disabled={isLoading}
        className="mx-6"
      >
        <span>Start Session</span>
        <ArrowRight />
      </Button>
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
        <Select value={value ?? ""} onValueChange={(v) => updateValue(v as T)}>
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
