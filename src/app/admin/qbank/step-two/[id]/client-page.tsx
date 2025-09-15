"use client";

import ActionsButtons from "@/app/admin/_components/action-buttons";
import useDeepState from "@/hooks/use-deep-state";
import { StepTwoNBMEQuestion } from "@/types";
import { saveQuestion } from "./actions";
import { useState } from "react";
import EditQuestionView from "../../edit-question-view";

type ClientStepTwoNbmeReviewPageProps = {
  question: StepTwoNBMEQuestion;
};

export default function ClientStepTwoNbmeReviewPage({
  question,
}: ClientStepTwoNbmeReviewPageProps) {
  const [edit, updateEdit] = useDeepState(structuredClone({ question }));
  const [isSaving, setIsSaving] = useState(false);
  const hasChanges = JSON.stringify(edit) !== JSON.stringify({ question });

  async function handleSave() {
    setIsSaving(true);
    await saveQuestion(edit.question);
    setIsSaving(false);
  }

  function handleDiscard() {
    updateEdit((prev) => {
      prev.question = structuredClone(question);
    });
  }

  return (
    <main className="flex flex-col gap-8 p-8">
      <EditQuestionView question={edit.question} onUpdate={updateEdit} />
      <ActionsButtons
        saveDisabled={isSaving || !hasChanges}
        discardDisabled={isSaving || !hasChanges}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </main>
  );
}
