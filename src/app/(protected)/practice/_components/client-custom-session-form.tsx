"use client";

import GradientTitle from "@/components/gradient-title";
import { MINS_PER_QUESTION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  getCategories,
  NBMEStep,
  QBankMode,
  QUESTION_TYPES,
  SYSTEMS,
} from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createQbankSession } from "../actions";
import { useSession } from "@/contexts/session-provider";
import { toast } from "sonner";
import DropdownSelect from "@/components/dropdown-select";

const DIGITS = "1234567890";

function isInt(n: string) {
  for (const char of n) {
    if (!DIGITS.includes(char)) return false;
  }
  return true;
}

export type Filters = {
  competencies: string[];
  concepts: string[];
  systems: string[];
  types: string[];
  difficulties: string[];
  yields: string[];
};

export default function ClientCustomSessionForm() {
  const { id, exam } = useSession();
  const [size, setSize] = useState<string>("10");
  const [isSizeCustom, setIsSizeCustom] = useState(false);
  const [mode, setMode] = useState<QBankMode>("timed");
  const [step, setStep] = useState<NBMEStep>(exam);
  const [systems, setSystems] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const router = useRouter();
  const isRandom =
    systems.length === 0 && categories.length === 0 && types.length === 0;

  function selectSize(size: string) {
    setSize(size);
    setIsSizeCustom(false);
  }

  function handleSizeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const newSize = e.target.value;
    if (isInt(newSize) || newSize === "") {
      setSize(newSize);
    }
  }

  async function handleStartSession() {
    const numericSize = parseInt(size);
    if (isNaN(numericSize)) {
      toast.error("Please enter a valid number of questions", {
        richColors: true,
      });
      return;
    }
    const sessionId = await createQbankSession(id, mode, step, numericSize, {
      systems,
      competencies: [],
      concepts: [],
      types: [],
      difficulties: [],
      yields: [],
    });
    router.push(`/practice/${sessionId}`);
    // TODO: handle errors
  }

  function handleChangeMode(step: NBMEStep) {
    setStep(step);
    handleRandom();
  }

  function handleRandom() {
    setSystems([]);
    setCategories([]);
    setTypes([]);
  }

  // TODO: fix no bottom padding
  return (
    <div className="flex flex-col items-center gap-8 p-8 h-full">
      <GradientTitle text="Custom Session" className="font-bold text-4xl" />
      <p className="text-muted-foreground">
        Tailored study sessions that adapt to your goals
      </p>
      <InputCard title="Step" number="1">
        <div className="flex gap-4">
          <OutlineButton
            label="Step 1"
            isActive={step === "Step 1"}
            onClick={() => handleChangeMode("Step 1")}
          />
          <OutlineButton
            label="Step 2"
            isActive={step === "Step 2"}
            onClick={() => handleChangeMode("Step 2")}
          />
        </div>
      </InputCard>
      <InputCard title="Focus" number="2">
        <div className="flex gap-4 py-2">
          <DropdownSelect
            title="Systems"
            options={SYSTEMS.map((s) => s.system)}
            selected={systems}
            setSelected={setSystems}
          />
          <DropdownSelect
            title="Categories"
            options={getCategories(systems)}
            selected={categories}
            setSelected={setCategories}
          />
          {step === "Step 2" && (
            <DropdownSelect
              title="Types"
              options={QUESTION_TYPES}
              selected={types}
              setSelected={setTypes}
            />
          )}
          <OutlineButton
            label="Random"
            isActive={isRandom}
            onClick={handleRandom}
          />
        </div>
      </InputCard>
      <InputCard title="Size" number="3">
        <div className="flex gap-4">
          <OutlineButton
            label="10"
            isActive={size === "10" && !isSizeCustom}
            onClick={() => selectSize("10")}
          />
          <OutlineButton
            label="20"
            isActive={size === "20" && !isSizeCustom}
            onClick={() => selectSize("20")}
          />
          <OutlineButton
            label="40"
            isActive={size === "40" && !isSizeCustom}
            onClick={() => selectSize("40")}
          />
          <OutlineButton
            label="Custom"
            isActive={isSizeCustom}
            onClick={() => setIsSizeCustom(true)}
          />
        </div>
        {isSizeCustom && (
          <input
            type="text"
            value={size}
            onChange={handleSizeInput}
            className="p-2 border rounded-md"
          />
        )}
        {size !== "" && mode === "timed" && (
          <p className="text-muted-foreground text-sm">
            {size} questions = {parseInt(size) * MINS_PER_QUESTION} minutes
          </p>
        )}
      </InputCard>
      <InputCard title="Mode" number="4">
        <div className="flex gap-4">
          <OutlineButton
            label="Timed Exam Mode"
            subheadline="Simulate NBME conditions with time pressure"
            isActive={mode === "timed"}
            onClick={() => setMode("timed")}
          />
          <OutlineButton
            label="Tutor Mode"
            subheadline="Get feedback and explanations as you go"
            isActive={mode === "tutor"}
            onClick={() => setMode("tutor")}
          />
        </div>
      </InputCard>
      <button
        className="flex justify-center items-center gap-2 bg-custom-accent p-4 rounded-md w-[40%] font-semibold"
        onClick={handleStartSession}
      >
        Start Session
      </button>
    </div>
  );
}

type InputCardProps = {
  children: React.ReactNode;
  title: string;
  number: string;
};

function InputCard({ children, title, number }: InputCardProps) {
  return (
    <div className="flex flex-col gap-4 bg-tertiary p-4 border rounded-md w-full">
      <div className="flex items-center gap-4">
        <p className="place-items-center grid bg-custom-accent rounded-full w-[32px] aspect-square font-semibold text-background">
          {number}
        </p>
        <p className="font-semibold text-lg">{title}</p>
      </div>
      {children}
    </div>
  );
}

type OutlineButtonProps = {
  label: string;
  subheadline?: string;
  onClick?: (e: React.MouseEvent) => void;
  isActive?: boolean;
};

function OutlineButton({
  label,
  subheadline,
  onClick,
  isActive,
}: OutlineButtonProps) {
  return (
    <button
      className={cn(
        "flex flex-col flex-1 justify-center items-center bg-muted p-2 border rounded-md transition-all",
        isActive && "border-custom-accent bg-custom-accent-light"
      )}
      onClick={onClick}
    >
      <span className="font-semibold text-sm">{label}</span>
      {subheadline && (
        <span className="text-muted-foreground text-xs">{subheadline}</span>
      )}
    </button>
  );
}
