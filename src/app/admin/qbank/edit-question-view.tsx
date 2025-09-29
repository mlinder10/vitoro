import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useDeepState from "@/hooks/use-deep-state";
import { cn } from "@/lib/utils";
import { NBMEQuestion, QuestionChoice } from "@/types";

type EditQuestionViewProps = {
  question: NBMEQuestion;
  onUpdate: ReturnType<typeof useDeepState<{ question: NBMEQuestion }>>[1];
};

export default function EditQuestionView({
  question,
  onUpdate,
}: EditQuestionViewProps) {
  return (
    <section className="flex flex-col gap-2 bg-tertiary p-4 border rounded-md">
      <div className="space-y-2">
        <Label>Question Stem</Label>
        <Textarea
          value={question.question}
          onChange={(e) =>
            onUpdate((prev) => {
              prev.question.question = e.target.value;
            })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        {(["a", "b", "c", "d", "e"] as const).map((letter) => (
          <QuestionChoiceView
            key={letter}
            question={question}
            letter={letter}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </section>
  );
}

type QuestionChoiceViewProps = {
  question: NBMEQuestion;
  letter: QuestionChoice;
  onUpdate: ReturnType<typeof useDeepState<{ question: NBMEQuestion }>>[1];
};

function QuestionChoiceView({
  question,
  letter,
  onUpdate,
}: QuestionChoiceViewProps) {
  return (
    <div className="flex items-center gap-4">
      <span
        className={cn(
          "cursor-pointer",
          letter === question.answer && "text-green-500"
        )}
        onClick={() => onUpdate((prev) => (prev.question.answer = letter))}
      >
        {letter.toUpperCase()}
      </span>
      <Input
        value={question.choices[letter]}
        onChange={(e) =>
          onUpdate((prev) => (prev.question.choices[letter] = e.target.value))
        }
      />
    </div>
  );
}
