"use client";

import { Label } from "@/components/ui/label";
import { handleCreateQuestion } from "./actions";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { NotebookPen, Sparkles } from "lucide-react";
import { getSystems, QUESTION_TYPES, System } from "@/types";
import { Input } from "@/components/ui/input";
import FormSelect from "@/components/form-select";

export default function CreateQuestionPage() {
  const [error, action, isPending] = useActionState(handleCreateQuestion, {});
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
          variant="accent"
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
