import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useDeepState from "@/hooks/use-deep-state";
import { cn } from "@/lib/utils";
import { Minus } from "lucide-react";

export type MultipleChoiceQuestion = {
  stem: string;
  choices: { letter: string; text: string }[];
  correct: string;
};

export const DEFAULT_MULTIPLE_CHOICE: MultipleChoiceQuestion = {
  stem: "",
  choices: [{ letter: "a", text: "" }],
  correct: "a",
};

const LETTERS = "abcdef";

type QuestionUploadProps = {
  question: MultipleChoiceQuestion;
  onUpdate: ReturnType<typeof useDeepState<MultipleChoiceQuestion>>[1];
};

export default function QuestionUpload({
  question,
  onUpdate,
}: QuestionUploadProps) {
  function handleAddChoice() {
    if (question.choices.length >= LETTERS.length) return;
    onUpdate((prev) => {
      prev.choices.push({ letter: LETTERS[prev.choices.length], text: "" });
    });
  }

  function handleClear() {
    onUpdate((prev) => {
      prev.stem = "";
      prev.choices = [{ letter: "a", text: "" }];
      prev.correct = "a";
    });
  }

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex flex-col flex-1 gap-2 bg-tertiary p-4 border rounded-md">
        <Textarea
          placeholder="Question Stem"
          value={question.stem}
          onChange={(e) => onUpdate((prev) => (prev.stem = e.target.value))}
          className="flex-1"
        />
        <div className="flex flex-col gap-2">
          {question.choices.map((c) => (
            <QuestionChoiceView
              key={c.letter}
              question={question}
              letter={c.letter}
              onUpdate={onUpdate}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAddChoice}
            disabled={question.choices.length >= LETTERS.length}
            variant="accent"
            className="w-fit"
          >
            Add Choice
          </Button>
          <Button variant="destructive" className="w-fit" onClick={handleClear}>
            Clear Question
          </Button>
        </div>
      </div>
    </div>
  );
}

type QuestionChoiceViewProps = {
  question: MultipleChoiceQuestion;
  letter: string;
  onUpdate: ReturnType<typeof useDeepState<MultipleChoiceQuestion>>[1];
};

function QuestionChoiceView({
  question,
  letter,
  onUpdate,
}: QuestionChoiceViewProps) {
  function handleDeleteChoice() {
    onUpdate((prev) => {
      prev.choices = prev.choices.filter((c) => c.letter !== letter);
      for (let i = 0; i < prev.choices.length; i++) {
        if (prev.choices[i].letter === question.correct) {
          // TODO: update correct
        }
        prev.choices[i].letter = LETTERS[i];
      }
      if (question.correct === letter) {
        prev.correct = prev.choices[0].letter;
      }
    });
  }

  return (
    <div className="flex items-center gap-4">
      <span
        className={cn(
          "cursor-pointer",
          letter === question.correct && "text-green-500"
        )}
        onClick={() => onUpdate((prev) => (prev.correct = letter))}
      >
        {letter.toUpperCase()}
      </span>
      <Input
        value={question.choices.find((c) => c.letter === letter)?.text || ""}
        onChange={(e) =>
          onUpdate((prev) => {
            const index = prev.choices.findIndex((c) => c.letter === letter);
            if (index === -1) return;
            prev.choices[index].text = e.target.value;
          })
        }
      />
      {question.choices.length > 1 && (
        <Button variant="destructive" onClick={handleDeleteChoice}>
          <Minus />
        </Button>
      )}
    </div>
  );
}
