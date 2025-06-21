"use client";

import { Label } from "@/components/ui/label";
import {
  CreateQuestionError,
  handleCreateBlankQuestion,
  handleGenerateQuestion,
} from "./actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, NotebookPen, Sparkles } from "lucide-react";
import { useSession } from "@/contexts/session-provider";
import {
  AnyCategory,
  AnySubcategory,
  QUESTION_TYPES,
  QuestionType,
  System,
  SYSTEMS,
} from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function CreateQuestionPage() {
  const { id } = useSession();
  const [error, setError] = useState<CreateQuestionError | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [system, setSystem] = useState<System | undefined>();
  const [category, setCategory] = useState<AnyCategory | undefined>();
  const [subcategory, setSubcategory] = useState<AnySubcategory | undefined>();
  const [type, setType] = useState<QuestionType | undefined>();
  const systems = SYSTEMS.map((s) => s.name);
  const categories =
    SYSTEMS.find((s) => s.name === system)?.categories.map((c) => c.name) ?? [];
  const subcategories =
    SYSTEMS.find((s) => s.name === system)?.categories.find(
      (c) => c.name === category
    )?.subcategories ?? [];
  const router = useRouter();

  async function onGenerateClick() {
    if (!system || !category || !subcategory || !type) return;
    setError(undefined);
    setIsGenerating(true);
    const res = await handleGenerateQuestion(
      id,
      system,
      category,
      subcategory,
      type
    );
    if (res.success) router.push(res.redirectTo);
    else if (res.success === false) setError(res);
    setIsGenerating(false);
  }

  async function onCreateClick() {
    if (!system || !category || !subcategory || !type) return;
    setError(undefined);
    setIsCreating(true);
    const res = await handleCreateBlankQuestion(
      id,
      system,
      category,
      subcategory,
      type
    );
    if (res.success) router.push(res.redirectTo);
    else if (res.success === false) setError(res);
    setIsCreating(false);
  }

  function handleSelectSystem(system: System) {
    setSystem(system);
    setCategory(undefined);
    setSubcategory(undefined);
  }

  function handleSelectCategory(category: AnyCategory) {
    setCategory(category);
    setSubcategory(undefined);
  }

  function handleSelectSubcategory(subcategory: AnySubcategory) {
    setSubcategory(subcategory);
  }

  return (
    <main className="items-center grid h-page">
      <form className="flex flex-col gap-4 bg-secondary mx-auto p-4 border-2 rounded-md w-1/3">
        <h1 className="mx-auto font-bold text-2xl">Create Question</h1>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={type}
            onValueChange={(v) => setType(v as QuestionType)}
          >
            <SelectTrigger id="type" name="type" className="w-full">
              <SelectValue placeholder="Select a question type" />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error?.type && (
            <p className="text-destructive text-sm">{error.type}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="system">System</Label>
          <Select value={system} onValueChange={handleSelectSystem}>
            <SelectTrigger id="system" name="system" className="w-full">
              <SelectValue placeholder="Select a system" />
            </SelectTrigger>
            <SelectContent>
              {systems.map((system) => (
                <SelectItem key={system} value={system}>
                  {system}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error?.system && (
            <p className="text-destructive text-sm">{error.system}</p>
          )}
        </div>
        {system && (
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={handleSelectCategory}>
              <SelectTrigger id="category" name="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error?.category && (
              <p className="text-destructive text-sm">{error.category}</p>
            )}
          </div>
        )}
        {category && (
          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory</Label>
            <Select value={subcategory} onValueChange={handleSelectSubcategory}>
              <SelectTrigger
                id="subcategory"
                name="subcategory"
                className="w-full"
              >
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory} value={subcategory}>
                    {subcategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error?.subcategory && (
              <p className="text-destructive text-sm">{error.subcategory}</p>
            )}
          </div>
        )}
        {subcategory && type && (
          <>
            <Button
              className="w-full"
              variant="accent"
              disabled={isGenerating || isCreating}
              name="action"
              value="generate"
              onClick={onGenerateClick}
            >
              <span>
                {isGenerating ? "Generating..." : "Generate Question"}
              </span>
              {isGenerating ? (
                <Loader className="animate-spin" />
              ) : (
                <Sparkles />
              )}
            </Button>
            <Button
              className="w-full"
              variant="accent-tertiary"
              disabled={isGenerating || isCreating}
              name="action"
              value="create"
              onClick={onCreateClick}
            >
              <span>{isCreating ? "Creating..." : "Blank Question"}</span>
              {isCreating ? (
                <Loader className="animate-spin" />
              ) : (
                <NotebookPen />
              )}
            </Button>
          </>
        )}
      </form>
    </main>
  );
}
