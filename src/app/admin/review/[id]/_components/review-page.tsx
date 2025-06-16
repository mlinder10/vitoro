import { ParsedQuestion, ParsedAudit, QuestionChoice } from "@/types";
import AuditSection from "./audit-section";
import { Check, X } from "lucide-react";
import { ReviewPageType } from "./page-wrapper";

type ReviewPageProps = {
  question: ParsedQuestion;
  audit: ParsedAudit | null;
  setPageType: (pageType: ReviewPageType) => void;
};

export default function ReviewPage({
  question,
  audit,
  setPageType,
}: ReviewPageProps) {
  return (
    <main className="flex h-page">
      <QuestionSection question={question} />
      <AuditSection
        question={question}
        audit={audit}
        pageType={"review"}
        setPageType={setPageType}
      />
    </main>
  );
}

// Question Section ============================================================

type QuestionSectionProps = {
  question: ParsedQuestion;
};

function QuestionSection({ question }: QuestionSectionProps) {
  return (
    <section className="flex-3/4 space-y-4 p-4 overflow-y-auto">
      <p>{question.question}</p>
      <ul className="space-y-2">
        {Object.entries(question.choices).map(([letter, choice]) => (
          <QuestionChoiceItem
            key={letter}
            choice={choice}
            letter={letter as QuestionChoice}
            explanation={question.explanations[letter as QuestionChoice]}
            isAnswer={letter === question.answer}
          />
        ))}
      </ul>
      <div className="space-y-2">
        <p className="font-semibold">References</p>
        <ul className="space-y-2">
          {question.sources.map((source, index) => (
            <li
              key={index}
              className="ml-4 text-muted-foreground text-xs -indent-4"
            >
              {source}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type QuestionChoiceItemProps = {
  choice: string;
  explanation: string;
  letter: QuestionChoice;
  isAnswer: boolean;
};

function QuestionChoiceItem({
  choice,
  explanation,
  letter,
  isAnswer,
}: QuestionChoiceItemProps) {
  return (
    <li className="bg-secondary p-2 border-2 rounded-md">
      <div className="flex items-center gap-2">
        {isAnswer ? (
          <Check className="text-green-500" />
        ) : (
          <X className="text-red-500" />
        )}
        <span className="font-bold">{letter.toUpperCase()}</span>
        <span>{choice}</span>
      </div>
      <p className="text-muted-foreground text-sm">{explanation}</p>
    </li>
  );
}
