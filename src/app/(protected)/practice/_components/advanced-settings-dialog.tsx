import { NBMEStep, QUESTION_DIFFICULTIES, YIELD_TYPES } from "@/types";
import { ReactNode, useEffect, useState } from "react";
import { fetchStepOneData, fetchStepTwoData } from "../actions";
import { cn } from "@/lib/utils";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

type AdvancedSettingsDialogProps = {
  step: NBMEStep;
  onApply?: (
    competencies: string[],
    concepts: string[],
    systems: string[],
    types: string[],
    difficulties: string[],
    yields: string[]
  ) => void;
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
  onApply,
}: AdvancedSettingsDialogProps) {
  const [selectedComps, setSelectedComps] = useState<string[]>([]);
  const [selectedCons, setSelectedCons] = useState<string[]>([]);
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDiffs, setSelectedDiffs] = useState<string[]>([]);
  const [selectedYields, setSelectedYields] = useState<string[]>([]);

  function toggleCompetency(competency: string, isSelected: boolean) {
    if (isSelected)
      setSelectedComps(selectedComps.filter((c) => c !== competency));
    else setSelectedComps([...selectedComps, competency]);
  }

  function toggleConcept(concept: string, isSelected: boolean) {
    if (isSelected) setSelectedCons(selectedCons.filter((c) => c !== concept));
    else setSelectedCons([...selectedCons, concept]);
  }

  function toggleSystem(system: string, isSelected: boolean) {
    if (isSelected)
      setSelectedSystems(selectedSystems.filter((s) => s !== system));
    else setSelectedSystems([...selectedSystems, system]);
  }

  function toggleType(type: string, isSelected: boolean) {
    if (isSelected) setSelectedTypes(selectedTypes.filter((t) => t !== type));
    else setSelectedTypes([...selectedTypes, type]);
  }

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

  function handleApply() {
    onApply?.(
      selectedComps,
      selectedCons,
      selectedSystems,
      selectedTypes,
      selectedDiffs,
      selectedYields
    );
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Advanced Settings</DialogTitle>
        <DialogDescription>Description</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        {step === "Step 1" && (
          <StepOneSettings
            selectedComps={selectedComps}
            selectedCons={selectedCons}
            toggleCompetency={toggleCompetency}
            toggleConcept={toggleConcept}
          />
        )}
        {step === "Step 2" && (
          <StepTwoSettings
            selectedSystems={selectedSystems}
            selectedTypes={selectedTypes}
            toggleSystem={toggleSystem}
            toggleType={toggleType}
          />
        )}
        <SharedSettings
          selectedDiffs={selectedDiffs}
          selectedYields={selectedYields}
          toggleDiff={toggleDiff}
          toggleYield={toggleYield}
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
        <Button variant="accent" onClick={handleApply}>
          Apply
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// Step 1

type StepOneSettingsProps = {
  selectedComps: string[];
  selectedCons: string[];
  toggleCompetency: (competency: string, isSelected: boolean) => void;
  toggleConcept: (concept: string, isSelected: boolean) => void;
};

function StepOneSettings({
  selectedComps,
  selectedCons,
  toggleCompetency,
  toggleConcept,
}: StepOneSettingsProps) {
  const [competencies, setCompetencies] = useState<string[]>([]);
  const [concepts, setConcepts] = useState<string[]>([]);

  useEffect(() => {
    fetchStepOneData().then(({ competencies, concepts }) => {
      setCompetencies(competencies);
      setConcepts(concepts);
    });
  }, []);

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

type StepTwoSettingsProps = {
  selectedSystems: string[];
  selectedTypes: string[];
  toggleSystem: (system: string, isSelected: boolean) => void;
  toggleType: (type: string, isSelected: boolean) => void;
};

function StepTwoSettings({
  selectedSystems,
  selectedTypes,
  toggleSystem,
  toggleType,
}: StepTwoSettingsProps) {
  const [systems, setSystems] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchStepTwoData().then(({ systems, types }) => {
      setSystems(systems);
      setTypes(types);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 bg-tertiary p-4 border rounded-md">
        {systems.map((s) => {
          const isSelected = selectedSystems.includes(s);
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

type SharedSettingsProps = {
  selectedDiffs: string[];
  selectedYields: string[];
  toggleDiff: (difficulty: string, isSelected: boolean) => void;
  toggleYield: (yield_: string, isSelected: boolean) => void;
};

function SharedSettings({
  selectedDiffs,
  selectedYields,
  toggleDiff,
  toggleYield,
}: SharedSettingsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 bg-tertiary p-2 border rounded-md">
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
      <div className="flex flex-wrap gap-2 bg-tertiary p-2 border rounded-md">
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
        "bg-background px-2 py-1 border rounded-md text-muted-foreground text-sm transition-all cursor-pointer",
        selected &&
          "bg-custom-accent-light border-custom-accent text-custom-accent"
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
