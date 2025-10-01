"use client";

import LoadingButton from "@/components/loading-btn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFormState from "@/hooks/use-form-state";
import { applyForBeta } from "./actions";

export default function BetaApplicationForm() {
  const { state, update, result, submit } = useFormState(
    { email: "" },
    async (state) => await applyForBeta(state.email)
  );

  if (result.success) {
    return (
      <div className="">
        <p className="font-semibold">Your application has been submitted.</p>
        <p className="text-muted-foreground text-sm">
          Thank you for your interest!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-tertiary p-4 border rounded-md">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@email.com"
          value={state.email}
          onChange={(e) => update("email", e.target.value)}
        />
        {result.error && result.errors.email && (
          <p className="text-destructive text-sm">{result.errors.email}</p>
        )}
      </div>
      <LoadingButton
        variant="accent"
        disabled={!result.idle}
        loading={result.loading}
        onClick={submit}
      >
        Submit
      </LoadingButton>
    </div>
  );
}
