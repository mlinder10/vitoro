import { NBMEStep, QUESTION_DIFFICULTIES, YIELD_TYPES } from "@/types";
import { ReactNode, useEffect, useState } from "react";
import { fetchStepOneData, fetchStepTwoData } from "../actions";
import { cn } from "@/lib/utils";

type AdvancedSettingsDialogProps = {
  step: NBMEStep;
};

// Filters

// Step 1:
// - competency
// - concept

// Step 2:
// - system
// - type

// Shared:
// - difficulty
// - yield

export default function AdvancedSettingsDialog({
  step,
}: AdvancedSettingsDialogProps) {
  return (
    <div>
      {step === "Step 1" && <StepOneSettings />}
      {step === "Step 2" && <StepTwoSettings />}
      <SharedSettings />
    </div>
  );
}

// Step 1

function StepOneSettings() {
  const [competencies, setCompetencies] = useState<string[]>([]);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [selectedComps, setSelectedComps] = useState<string[]>([]);
  const [selectedCons, setSelectedCons] = useState<string[]>([]);

  useEffect(() => {
    fetchStepOneData().then(({ competencies, concepts }) => {
      setCompetencies(competencies);
      setConcepts(concepts);
    });
  }, []);

  function toggleCompetency(competency: string, isSelected: boolean) {
    if (isSelected)
      setSelectedComps(selectedComps.filter((c) => c !== competency));
    else setSelectedComps([...selectedComps, competency]);
  }

  function toggleConcept(concept: string, isSelected: boolean) {
    if (isSelected) setSelectedCons(selectedCons.filter((c) => c !== concept));
    else setSelectedCons([...selectedCons, concept]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 bg-tertiary p-4 border rounded-md">
        {competencies.map((c) => {
          const isSelected = selectedComps.includes(c);
          return (
            <SelectPill
              key={c}
              selected={isSelected}
              onClick={() => toggleCompetency(c, isSelected)}
            >
              {c}
            </SelectPill>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 bg-tertiary p-4 border rounded-md">
        {concepts.map((c) => {
          const isSelected = selectedCons.includes(c);
          return (
            <SelectPill
              key={c}
              selected={isSelected}
              onClick={() => toggleConcept(c, isSelected)}
            >
              {c}
            </SelectPill>
          );
        })}
      </div>
    </div>
  );
}

// Step 2

function StepTwoSettings() {
  const [systems, setSystems] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedSys, setSelectedSys] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchStepTwoData().then(({ systems, types }) => {
      setSystems(systems);
      setTypes(types);
    });
  }, []);

  function toggleSystem(system: string, isSelected: boolean) {
    if (isSelected) setSelectedSys(selectedSys.filter((s) => s !== system));
    else setSelectedSys([...selectedSys, system]);
  }

  function toggleType(type: string, isSelected: boolean) {
    if (isSelected) setSelectedTypes(selectedTypes.filter((t) => t !== type));
    else setSelectedTypes([...selectedTypes, type]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 bg-tertiary p-4 border rounded-md">
        {systems.map((s) => {
          const isSelected = selectedSys.includes(s);
          return (
            <SelectPill
              key={s}
              selected={isSelected}
              onClick={() => toggleSystem(s, isSelected)}
            >
              {s}
            </SelectPill>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 bg-tertiary p-4 border rounded-md">
        {types.map((t) => {
          const isSelected = selectedTypes.includes(t);
          return (
            <SelectPill
              key={t}
              selected={isSelected}
              onClick={() => toggleType(t, isSelected)}
            >
              {t}
            </SelectPill>
          );
        })}
      </div>
    </div>
  );
}

// Common

function SharedSettings() {
  const [selectedDiffs, setSelectedDiffs] = useState<string[]>([]);
  const [selectedYields, setSelectedYields] = useState<string[]>([]);

  function toggleDiff(difficulty: string, isSelected: boolean) {
    if (isSelected)
      setSelectedDiffs(selectedDiffs.filter((d) => d !== difficulty));
    else setSelectedDiffs([...selectedDiffs, difficulty]);
  }

  function toggleYield(_yield: string, isSelected: boolean) {
    if (isSelected)
      setSelectedYields(selectedYields.filter((y) => y !== _yield));
    else setSelectedYields([...selectedYields, _yield]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 bg-tertiary p-4 border rounded-md">
        {QUESTION_DIFFICULTIES.map((d) => {
          const isSelected = selectedDiffs.includes(d);
          return (
            <SelectPill
              key={d}
              selected={isSelected}
              onClick={() => toggleDiff(d, isSelected)}
            >
              {d}
            </SelectPill>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 bg-tertiary p-4 border rounded-md">
        {YIELD_TYPES.map((y) => {
          const isSelected = selectedYields.includes(y);
          return (
            <SelectPill
              key={y}
              selected={isSelected}
              onClick={() => toggleYield(y, isSelected)}
            >
              {y}
            </SelectPill>
          );
        })}
      </div>
    </div>
  );
}

// Components

type SelectPillProps = {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
};

function SelectPill({ children, selected, onClick }: SelectPillProps) {
  return (
    <div
      className={cn(
        "p-2 border rounded-md text-muted-foreground text-sm",
        selected && "bg-custom-accent-light border-custom-accent"
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
