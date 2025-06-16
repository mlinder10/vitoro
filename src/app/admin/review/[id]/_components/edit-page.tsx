import { Textarea } from "@/components/ui/textarea";
import AuditSection from "./audit-section";
import { useAdminReview } from "@/contexts/admin-review-provider";
import { QuestionChoice } from "@/types";
import { Check, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function EditPage() {
  return (
    <main className="flex h-page">
      <QuestionSection />
      <AuditSection />
    </main>
  );
}

function QuestionSection() {
  const { question, editQuestion, updateQuestion, isSaving } = useAdminReview();

  return (
    <section className="flex-3/4 space-y-4 p-4 overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          name="question"
          placeholder="Question Stem"
          disabled={isSaving}
          value={editQuestion.question}
          onChange={(e) => updateQuestion("question", e.target.value)}
          className={cn(
            question.question !== editQuestion.question &&
              "border-custom-accent-secondary border-2 shadow-md focus-visible:border-custom-accent-secondary focus-visible:ring-custom-accent-secondary-dark"
          )}
        />
      </div>
      <ul className="space-y-2">
        {Object.entries(editQuestion.choices).map(([letter, choice]) => {
          const l = letter as QuestionChoice;
          return (
            <QuestionChoiceItem
              key={letter}
              choice={choice}
              letter={l}
              explanation={editQuestion.explanations[l]}
              isAnswer={letter === editQuestion.answer}
              hasChoiceChanges={question.choices[l] !== choice}
              hasExplanationChanges={
                question.explanations[l] !== editQuestion.explanations[l]
              }
            />
          );
        })}
      </ul>
    </section>
  );
}

type QuestionChoiceItemProps = {
  choice: string;
  explanation: string;
  letter: QuestionChoice;
  isAnswer: boolean;
  hasChoiceChanges: boolean;
  hasExplanationChanges: boolean;
};

function QuestionChoiceItem({
  choice,
  explanation,
  letter,
  isAnswer,
  hasChoiceChanges,
  hasExplanationChanges,
}: QuestionChoiceItemProps) {
  const { updateQuestion, isSaving } = useAdminReview();

  return (
    <li className="space-y-2 bg-secondary p-2 border-2 rounded-md">
      <div className="flex items-center gap-2">
        {isAnswer ? (
          <Check className="text-green-500" />
        ) : (
          <X className="text-red-500" />
        )}
        <span className="font-bold">{letter.toUpperCase()}</span>
        <Input
          placeholder={`Choice for ${letter.toUpperCase()}`}
          disabled={isSaving}
          value={choice}
          onChange={(e) =>
            updateQuestion("choices", (prev) => ({
              ...prev,
              [letter]: e.target.value,
            }))
          }
          className={cn(
            hasChoiceChanges &&
              "border-custom-accent-secondary border-2 shadow-md focus-visible:border-custom-accent-secondary focus-visible:ring-custom-accent-secondary-dark"
          )}
        />
      </div>
      <Textarea
        placeholder={`Explanation for ${letter.toUpperCase()}`}
        disabled={isSaving}
        value={explanation}
        onChange={(e) =>
          updateQuestion("explanations", (prev) => ({
            ...prev,
            [letter]: e.target.value,
          }))
        }
        className={cn(
          "resize-none",
          hasExplanationChanges &&
            "border-custom-accent-secondary border-2 shadow-md focus-visible:border-custom-accent-secondary focus-visible:ring-custom-accent-secondary-dark"
        )}
      />
    </li>
  );
}
