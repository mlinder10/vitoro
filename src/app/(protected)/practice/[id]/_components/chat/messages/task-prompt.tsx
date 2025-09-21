import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { capitalize } from "@/lib/utils";
import { Task, TASKS } from "@/types";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

type TaskPromptProps = {
  label: string;
  onClick: () => void;
};

export default function TaskPrompt({ label, onClick }: TaskPromptProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="w-full min-w-[80px] max-w-[240px]"
    >
      {label}
    </Button>
  );
}

const TASK_DESCRIPTIONS: Record<Task, string> = {
  breakdown: "Get a detailed breakdown of the concept being tested.",
  distractor: "Dive deeper to identify the distractors in this question.",
  "gap-finder":
    "Bridge knowledge gaps with a focused micro-lesson and reinforce understanding with targeted questions.",
  strategy:
    "Learn how to think like a doctor building a differential diagnosis before even looking at the answer choices.",
  pattern:
    "Find patterns that can help you distinguish between related concepts.",
  memory:
    "Get effective flashcards, cloze deletions, and mnemonics to cement key concepts in long-term memory.",
  "pimp-mode":
    "Face challenging free-response questions that progress from basic concepts to integration, testing real understanding.",
};

export function TaskTooltip() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="View prompt options"
        >
          <HelpCircle size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Prompt Options Guide</DialogTitle>
          <DialogDescription>
            Each prompt option provides a different learning approach for
            analyzing questions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {TASKS.map((task) => (
            <div
              key={task}
              className="pb-3 border-b border-border last:border-b-0"
            >
              <h4 className="mb-1 font-semibold text-sm">
                {task.split("-").map(capitalize).join(" ")}
              </h4>
              <p className="text-muted-foreground text-sm">
                {TASK_DESCRIPTIONS[task]}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
