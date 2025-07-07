"use client";

import { Label } from "@/components/ui/label";
import { handleCreateQuestion } from "./actions";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { NotebookPen, Sparkles } from "lucide-react";
import { useSession } from "@/contexts/session-provider";
import { AnyCategory, QUESTION_TYPES, System, SYSTEMS } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

function getSystems(
  system: System | undefined,
  category: AnyCategory | undefined
) {
  return {
    systems: SYSTEMS.map((s) => s.name),
    categories:
      SYSTEMS.find((s) => s.name === system)?.categories.map((c) => c.name) ??
      [],
    subcategories:
      SYSTEMS.find((s) => s.name === system)?.categories.find(
        (c) => c.name === category
      )?.subcategories ?? [],
  };
}

export default function CreateQuestionPage() {
  const { id } = useSession();
  const [error, action, isPending] = useActionState(
    handleCreateQuestion.bind(null, id),
    {}
  );
  const [system, setSystem] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const { systems, categories, subcategories } = getSystems(
    system as System,
    category
  );

  return (
    <main className="items-center grid py-8 h-page">
      <form
        className="flex flex-col gap-4 bg-secondary mx-auto p-4 border-2 rounded-md w-1/3"
        action={action}
      >
        <h1 className="mx-auto font-bold text-2xl">Create Question</h1>
        <FormSelect
          label="Type"
          options={QUESTION_TYPES}
          name="type"
          error={error?.type}
        />
        <FormSelect
          label="System"
          options={systems}
          name="system"
          value={system}
          updateValue={setSystem}
          error={error?.system}
        />
        <FormSelect
          label="Category"
          options={categories}
          name="category"
          value={category}
          updateValue={setCategory}
          error={error?.category}
        />
        <FormSelect
          label="Subcategory"
          options={subcategories}
          name="subcategory"
          error={error?.subcategory}
        />
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            type="text"
            name="topic"
            id="topic"
            placeholder="Topic"
            required
          />
        </div>
        <Button
          className="w-full"
          variant="accent"
          name="action"
          value="generate"
          type="submit"
          disabled={isPending}
        >
          <span>Generate Question</span>
          <Sparkles />
        </Button>
        <Button
          className="w-full"
          variant="accent-tertiary"
          name="action"
          value="create"
          type="submit"
          disabled={isPending}
        >
          <span>Blank Question</span>
          <NotebookPen />
        </Button>
        {error?.error && (
          <p className="text-destructive text-sm">{error.error}</p>
        )}
      </form>
    </main>
  );
}

type SelectItemProps = {
  label: string;
  name: string;
  value?: string;
  updateValue?: (value: string) => void;
  options: Readonly<string[]>;
  error: string[] | undefined;
};

function FormSelect({
  label,
  name,
  value,
  updateValue,
  options,
  error,
}: SelectItemProps) {
  if (value && updateValue) {
    return (
      <div className="space-y-2">
        <input type="hidden" name={name} value={value} />
        <Label>{label}</Label>
        <Select required onValueChange={updateValue}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a subcategory" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select required name={name} onValueChange={updateValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a subcategory" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
