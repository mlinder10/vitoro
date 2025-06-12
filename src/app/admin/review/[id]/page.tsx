import { fetchQuestionById } from "@/db/question";
import { ParsedAudit, ParsedQuestion, QuestionChoice } from "@/lib/types";
import { Check, X } from "lucide-react";
import { notFound } from "next/navigation";

const CHECKLIST = {
  "1": "One correct answer with all distractors clearly incorrect",
  "2": "Each distractor tests a plausible misunderstanding",
  "3": "Answer is consistent with vitals, labs, and imaging in the stem",
  "4": "No required data is missing for choosing the correct answer",
  "5": "Clinical presentation is realistic and not contradictory",
  "6": "Question requires clinical reasoning, not fact recall",
  "7": "No direct giveaway or naming of the diagnosis in the stem",
  "8": "Every answer choice is anchored to clues in the vignette",
  "9": "No duplicate correct answers or overly vague distractors",
};

type ReviewQuestionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReviewQuestionPage({
  params,
}: ReviewQuestionPageProps) {
  const { id } = await params;
  const q = await fetchQuestionById(id);
  if (!q) return notFound();
  const { question, audit } = q;

  return (
    <main className="flex h-page">
      <QuestionSection question={question} />
      <AuditSection audit={audit} />
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

// Audit Section ===============================================================

type AuditSectionProps = {
  audit: ParsedAudit | null;
};

function AuditSection({ audit }: AuditSectionProps) {
  function renderAuditStatus() {
    switch (audit?.rating) {
      case "Pass":
        return (
          <p className="bg-green-500 m-2 py-2 border-2 border-green-700 rounded-md text-green-950 text-center">
            Passed
          </p>
        );
      case "Flag for Human Review":
        return (
          <p className="bg-yellow-300 m-2 py-2 border-2 border-yellow-500 rounded-md text-yellow-800 text-center">
            Flagged
          </p>
        );
      case "Reject":
        return (
          <p className="bg-red-500 m-2 py-2 border-2 border-red-700 rounded-md text-red-950 text-center">
            Rejected
          </p>
        );
    }
  }

  function renderSuggestions() {
    if (audit?.suggestions.length === 0) {
      return (
        <p className="py-4 text-muted-foreground text-center">No suggestions</p>
      );
    }

    return (
      <ul className="pl-4 list-disc">
        {audit?.suggestions.map((suggestion, index) => (
          <li key={index} className="text-muted-foreground text-sm">
            {suggestion}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="flex-1/4 space-y-4 bg-secondary border-l-2 overflow-y-auto">
      {renderAuditStatus()}
      <ul>
        {Object.entries(audit?.checklist || {}).map(([index, item]) => (
          <li key={index} className="p-2 border-b-2 text-sm">
            <div className="flex items-center gap-2">
              {item.pass ? (
                <Check className="text-green-500" />
              ) : (
                <X className="text-red-500" />
              )}
              <span>
                {index}.{" "}
                {CHECKLIST[index as keyof typeof CHECKLIST] ?? "No description"}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{item.notes}</p>
          </li>
        ))}
      </ul>
      {renderSuggestions()}
    </section>
  );
}
