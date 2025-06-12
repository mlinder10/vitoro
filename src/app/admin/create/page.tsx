"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleGenerateQuestion } from "./actions";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { useSession } from "@/contexts/session-provider";

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
