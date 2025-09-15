"use client";

import ActionsButtons from "@/app/admin/_components/action-buttons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useDeepState from "@/hooks/use-deep-state";
import { cn } from "@/lib/utils";
import {
  QuestionChoice,
  StepOneFoundationalFollowup,
  StepOneFoundationalQuestion,
} from "@/types";

type FullFoundational = {
  question: StepOneFoundationalQuestion;
  followUps: StepOneFoundationalFollowup[];
};

type ClientStepOneFoundationalReviewPageProps = {
  question: StepOneFoundationalQuestion;
  followUps: StepOneFoundationalFollowup[];
};

export default function ClientStepOneFoundationalReviewPage({
  question,
  followUps,
}: ClientStepOneFoundationalReviewPageProps) {
  const [edit, updateEdit] = useDeepState({ question, followUps });

  async function handleSave() {}

  function handleDiscard() {
    updateEdit((prev) => {
      prev.question = question;
      prev.followUps = followUps;
    });
  }

  return (
    <main className="flex flex-col gap-8 p-8">
      <section className="flex flex-col gap-4 bg-tertiary p-4 border rounded-md">
        <div className="space-y-2">
          <Label>Question Stem</Label>
          <Textarea
            value={edit.question.question}
            onChange={(e) =>
              updateEdit((prev) => {
                prev.question.question = e.target.value;
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Diagnosis</Label>
          <Textarea
            value={edit.question.diagnosis}
            onChange={(e) =>
              updateEdit((prev) => (prev.question.diagnosis = e.target.value))
            }
          />
        </div>
      </section>
      {edit.followUps.map((f, i) => (
        <FollowupContainer
          key={f.id}
          followup={f}
          index={i}
          onUpdate={updateEdit}
        />
      ))}
      <ActionsButtons onSave={handleSave} onDiscard={handleDiscard} />
    </main>
  );
}

type FollowupContainerProps = {
  followup: StepOneFoundationalFollowup;
  index: number;
  onUpdate: ReturnType<typeof useDeepState<FullFoundational>>[1];
};

function FollowupContainer({
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
            onUpdate((prev) => (prev.followUps[0].question = e.target.value))
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
  followup: StepOneFoundationalFollowup;
  index: number;
  letter: QuestionChoice;
  onUpdate: ReturnType<typeof useDeepState<FullFoundational>>[1];
};

function FollowupChoice({
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
        onClick={() => onUpdate((prev) => (prev.followUps[0].answer = letter))}
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
