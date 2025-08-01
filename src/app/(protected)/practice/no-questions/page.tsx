import { ArrowLeft, Trophy } from "lucide-react";
import ResetDialog from "../_components/reset-dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompleteQuestionsPage() {
  return (
    <div className="place-items-center grid px-6 h-full text-muted-foreground text-center">
      <div className="flex flex-col items-center space-y-4">
        <Trophy className="w-12 h-12 text-primary" />
        <p className="font-bold text-2xl">You&apos;re All Caught Up!</p>
        <p className="max-w-md text-sm">
          You&apos;ve answered every available question in this category. Great
          job! You can select new filters or reset your progress below to start
          again.
        </p>
        <div className="flex gap-4">
          <Button asChild variant="accent">
            <Link href="/practice">
              <ArrowLeft />
              <span>New Filters</span>
            </Link>
          </Button>
          <ResetDialog />
        </div>
      </div>
    </div>
  );
}
