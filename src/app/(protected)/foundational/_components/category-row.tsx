"use client";

import { NBMEStep } from "@/types";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchUnansweredStepOne, fetchUnansweredStepTwo } from "../actions";
import { toast } from "sonner";

type CategoryRowProps = {
  category: string;
  answered: number;
  total: number;
  step: NBMEStep;
  userId: string;
};

export default function CategoryRow({
  category,
  answered,
  total,
  step,
  userId,
}: CategoryRowProps) {
  const router = useRouter();

  async function handleSelect() {
    switch (step) {
      case "Step 1":
        const stepOneId = await fetchUnansweredStepOne(userId, category);
        if (!stepOneId) {
          toast.error("No unanswered questions for this category", {
            richColors: true,
          });
          return;
        }
        router.push(`/foundational/step-one/${stepOneId}`);
        break;
      case "Step 2":
        const stepTwoId = await fetchUnansweredStepTwo(userId, category);
        if (!stepTwoId) {
          toast.error("No unanswered questions for this category", {
            richColors: true,
          });
          return;
        }
        router.push(`/foundational/step-two/${stepTwoId}`);
        break;
    }
  }

  return (
    <div
      className="flex justify-between items-center bg-tertiary p-4 border rounded-md cursor-pointer"
      onClick={handleSelect}
    >
      <div>
        <p className="font-semibold">{category}</p>
        <p className="text-muted-foreground">
          Answered {answered} / {total}
        </p>
      </div>
      <ChevronRight className="text-muted-foreground" size={16} />
    </div>
  );
}
