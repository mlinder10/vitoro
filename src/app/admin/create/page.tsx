"use client";

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
import { useRouter } from "next/navigation";

export default function CreateQuestionPage() {
  const { id } = useSession();
  const [error, action, isPending] = useActionState(onSubmit, {});
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
  const router = useRouter();

  async function onSubmit(_: unknown, data: FormData) {
    const res = await handleGenerateQuestion(id, data);
    if (res.success) router.push(res.redirectTo);
    else if (res.success === false) return res;
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
      <form
        action={action}
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
        {subcategory && (
          <Button
            className="w-full"
            type="submit"
            variant="accent"
            disabled={isPending}
          >
            <span>{isPending ? "Generating..." : "Generate"}</span>
            {isPending ? <Loader className="animate-spin" /> : <ArrowRight />}
          </Button>
        )}
      </form>
    </main>
  );
}
