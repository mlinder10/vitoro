import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useDeepState from "@/hooks/use-deep-state";
import { cn } from "@/lib/utils";
import {
  FoundationalFollowup,
  FoundationalQuestion,
  QuestionChoice,
} from "@/types";

type FullFoundational = {
  question: FoundationalQuestion;
  followUps: FoundationalFollowup[];
};

type FollowupContainerProps = {
  followup: FoundationalFollowup;
  index: number;
  onUpdate: ReturnType<typeof useDeepState<FullFoundational>>[1];
};

export function FollowupContainer({
  followup,
  index,
  onUpdate,
}: FollowupContainerProps) {
  return (
    <section
      key={followup.id}
      className="flex flex-col gap-2 bg-tertiary p-4 border rounded-md"
    >
      <div className="space-y-2">
        <Label>Question</Label>
        <Textarea
          value={followup.question}
          onChange={(e) =>
            onUpdate(
              (prev) => (prev.followUps[index].question = e.target.value)
            )
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        {(["a", "b", "c", "d", "e"] as const).map((letter) => (
          <FollowupChoice
            key={letter}
            followup={followup}
            letter={letter}
            index={index}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </section>
  );
}

type FollowupChoiceProps = {
  followup: FoundationalFollowup;
  index: number;
  letter: QuestionChoice;
  onUpdate: ReturnType<typeof useDeepState<FullFoundational>>[1];
};

export function FollowupChoice({
  followup,
  index,
  letter,
  onUpdate,
}: FollowupChoiceProps) {
  return (
    <div className="flex items-center gap-4">
      <span
        className={cn(
          "cursor-pointer",
          letter === followup.answer && "text-green-500"
        )}
        onClick={() =>
          onUpdate((prev) => (prev.followUps[index].answer = letter))
        }
      >
        {letter.toUpperCase()}
      </span>
      <Input
        value={followup.choices[letter]}
        onChange={(e) =>
          onUpdate(
            (prev) => (prev.followUps[index].choices[letter] = e.target.value)
          )
        }
      />
    </div>
  );
}
