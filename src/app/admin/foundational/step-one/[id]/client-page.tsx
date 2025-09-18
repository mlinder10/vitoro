"use client";

import ActionsButtons from "@/app/admin/_components/action-buttons";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useDeepState from "@/hooks/use-deep-state";
import {
  StepOneFoundationalFollowup,
  StepOneFoundationalQuestion,
} from "@/types";
import { saveQuestion } from "./actions";
import { useState } from "react";
import { FollowupContainer } from "../../followup-container";

type ClientStepOneFoundationalReviewPageProps = {
  question: StepOneFoundationalQuestion;
  followUps: StepOneFoundationalFollowup[];
};

export default function ClientStepOneFoundationalReviewPage({
  question,
  followUps,
}: ClientStepOneFoundationalReviewPageProps) {
  const [edit, updateEdit] = useDeepState({
    question: structuredClone(question),
    followUps: structuredClone(followUps),
  });
  const [isSaving, setIsSaving] = useState(false);
  const hasChanges =
    JSON.stringify(edit) !== JSON.stringify({ question, followUps });

  async function handleSave() {
    setIsSaving(true);
    await saveQuestion(edit.question, edit.followUps);
    setIsSaving(false);
  }

  function handleDiscard() {
    updateEdit((prev) => {
      prev.question = structuredClone(question);
      prev.followUps = structuredClone(followUps);
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
      <ActionsButtons
        saveDisabled={isSaving || !hasChanges}
        discardDisabled={isSaving || !hasChanges}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </main>
  );
}
