"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCcw } from "lucide-react";
import { resetProgress } from "../actions";
import { useState } from "react";
import { useSession } from "@/contexts/session-provider";
import { useRouter } from "next/navigation";

export default function ResetDialog() {
  const { id } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleReset() {
    setIsLoading(true);
    await resetProgress(id);
    setIsLoading(false);
    router.refresh();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="accent">
          <span>Reset Progress</span>
          <RefreshCcw />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Progress</DialogTitle>
          <DialogDescription>
            Are you sure you want to reset your progress? You will lose all of
            your stats and recommended study materials. This cannot be undone.
          </DialogDescription>
          <div className="flex gap-2">
            <DialogClose className="flex-1" asChild>
              <Button variant="outline">
                <span>Cancel</span>
              </Button>
            </DialogClose>
            <Button
              className="flex-1"
              variant="destructive"
              disabled={isLoading}
              onClick={handleReset}
            >
              <span>Clear</span>
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
