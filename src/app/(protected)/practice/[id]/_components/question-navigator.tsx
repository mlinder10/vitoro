import { cn } from "@/lib/utils";
import { NBMEQuestion, QuestionChoice } from "@/types";

type QuestionNavigatorProps = {
  questions: NBMEQuestion[];
  answers: (QuestionChoice | null)[];
  activeQuestion: NBMEQuestion;
  onSelect: (question: NBMEQuestion, index: number) => void;
};

export default function QuestionNavigator({
  questions,
  answers,
  activeQuestion,
  onSelect,
}: QuestionNavigatorProps) {
  return (
    <section className="flex flex-col gap-8 px-4 pt-8 border-r h-full overflow-y-auto">
      <p className="font-semibold text-muted-foreground">Question Navigator</p>
      <div className="gap-2 grid grid-cols-4">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className={cn(
              "place-items-center grid bg-tertiary border rounded-md w-[40px] aspect-square cursor-pointer",
              // incorrect
              answers[i] !== null && "border-red-600 bg-red-light",
              // correct
              q.answer === answers[i] && "border-green-600 bg-green-light",
              // active
              activeQuestion.id === q.id &&
                "bg-custom-accent-light border-custom-accent"
            )}
            onClick={() => onSelect(q, i)}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </section>
  );
}
