"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleGenerateQuestion } from "./actions";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { useSession } from "@/contexts/session-provider";
import { AnyCategory, AnySubcategory, System, SYSTEMS } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateQuestionPage() {
  const [system, setSystem] = useState<System | undefined>();
  const [category, setCategory] = useState<AnyCategory | undefined>();
  const [subcategory, setSubcategory] = useState<AnySubcategory | undefined>();
  const systems = SYSTEMS.map((s) => s.name);
  const categories =
    SYSTEMS.find((s) => s.name === system)?.categories.map((c) => c.name) ?? [];
  const subcategories =
    SYSTEMS.find((s) => s.name === system)?.categories.find(
      (c) => c.name === category
    )?.subcategories ?? [];

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
      <form
        action=""
        className="flex flex-col gap-4 bg-secondary mx-auto p-4 border-2 rounded-md w-1/3"
      >
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
          </div>
        )}
        {subcategory && (
          <Button className="w-full" type="submit" variant="accent">
            <span>Generate Question</span>
            <ArrowRight />
          </Button>
        )}
      </form>
    </main>
  );
}

export default function CreateQBankPage() {
  const session = useSession();
  const [error, action, isPending] = useActionState(
    handleGenerateQuestion.bind(null, session.id),
    {}
  );

  return (
    <main className="items-center grid h-page">
      <form
        action={action}
        className="flex flex-col gap-4 bg-secondary mx-auto p-4 border-2 rounded-md w-1/3"
      >
        <div className="space-y-2">
          <Label htmlFor="topic">Clinical Topic</Label>
          <Input
            id="topic"
            name="topic"
            type="text"
            placeholder='e.g. "Cardiovascular Pathophysiology"'
            required
          />
          {error.topic && (
            <p className="text-destructive text-sm">{error.topic}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="concept">Concept to Test</Label>
          <Input
            id="concept"
            name="concept"
            type="text"
            placeholder='e.g. "Diagnosis, Treatment"'
            required
          />
          {error.concept && (
            <p className="text-destructive text-sm">{error.concept}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Question Type</Label>
          <Input
            id="type"
            name="type"
            type="text"
            placeholder='e.g. "Most likely complication", "Next best step", etc.'
            required
          />
          {error.type && (
            <p className="text-destructive text-sm">{error.type}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sources">Reference Sources</Label>
          <Input
            id="sources"
            name="sources"
            type="text"
            placeholder="e.g., StatPearls, UTD, etc."
          />
          {error.sources && (
            <p className="text-destructive text-sm">{error.sources}</p>
          )}
        </div>
        <Button type="submit" disabled={isPending} variant="accent">
          {isPending ? (
            <>
              <span>Generating...</span>
              <Loader className="animate-spin" />
            </>
          ) : (
            <>
              <span>Generate</span>
              <ArrowRight />
            </>
          )}
        </Button>
      </form>
    </main>
  );
}
