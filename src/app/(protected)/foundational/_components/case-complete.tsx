"use client";

import { Button } from "@/components/ui/button";
import { NBMEStep } from "@/types";
import { fetchUnansweredStepOne, fetchUnansweredStepTwo } from "../actions";
import { useRouter } from "next/navigation";

type CaseCompleteProps = {
  step: NBMEStep;
  category: string;
  userId: string;
};

export default function CaseComplete({ step, category, userId }: CaseCompleteProps) {
  const router = useRouter();

  async function handleNext() {
    switch (step) {
      case "Step 1": {
        const id = await fetchUnansweredStepOne(userId, category);
        router.push(id ? `/foundational/step-one/${id}` : "/foundational/new");
        break;
      }
      case "Step 2": {
        const id = await fetchUnansweredStepTwo(userId, category);
        router.push(id ? `/foundational/step-two/${id}` : "/foundational/new");
        break;
      }
    }
  }

  return (
    <section className="flex flex-col items-center justify-center py-8 h-full">
      <div className="flex flex-col items-center gap-4 bg-tertiary mx-auto p-8 border rounded-md max-w-[800px]">
        <p className="font-semibold text-xl">Case Completed</p>
        <Button variant="accent" onClick={handleNext}>
          Next
        </Button>
      </div>
    </section>
  );
}
